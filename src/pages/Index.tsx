import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { ResultCard } from "@/components/ResultCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Court, Trophy, Users2 } from "lucide-react";

const LEAGUES_PER_PAGE = 10;

export type LeagueFilters = {
  location?: string;
  sportType?: string;
  skillLevel?: string;
  genderCategory?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'upcoming' | 'completed';
  hasSpots?: boolean;
};

const Index = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeagueFilters>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['leagues', page, filters, selectedLeagueId],
    queryFn: async () => {
      let query = supabase
        .from('leagues')
        .select('*, league_participants(count)')
        .order('created_at', { ascending: false });

      // If a specific league is selected through search
      if (selectedLeagueId) {
        query = query.eq('id', selectedLeagueId);
      } else {
        // Apply pagination only when not searching for a specific league
        query = query.range((page - 1) * LEAGUES_PER_PAGE, page * LEAGUES_PER_PAGE - 1);
      }

      if (filters.location) {
        query = query.eq('location', filters.location);
      }
      if (filters.sportType) {
        query = query.eq('sport_type', filters.sportType);
      }
      if (filters.skillLevel) {
        const [min, max] = filters.skillLevel.split('-').map(Number);
        query = query.gte('skill_level_min', min).lte('skill_level_max', max);
      }
      if (filters.genderCategory) {
        query = query.eq('gender_category', filters.genderCategory);
      }
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate.toISOString());
      }
      if (filters.status) {
        const now = new Date().toISOString();
        switch (filters.status) {
          case 'active':
            query = query.lte('start_date', now).gte('end_date', now);
            break;
          case 'upcoming':
            query = query.gt('start_date', now);
            break;
          case 'completed':
            query = query.lt('end_date', now);
            break;
        }
      }
      if (filters.hasSpots === true) {
        query = query.neq('league_participants.count', 'max_participants');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as (Tables<'leagues', never> & { league_participants: { count: number }[] })[];
    },
  });

  if (error) {
    toast.error('Failed to load leagues');
  }

  const handleSearch = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<LeagueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedLeagueId(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900">
      <div className="container max-w-6xl mx-auto py-8 md:py-12 space-y-8 px-4">
        {/* Hero Section */}
        <div className="text-left space-y-6 mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 max-w-2xl">
            Organiser sa pratique devient plus simple
          </h1>
          <p className="text-lg text-white max-w-3xl">
            Accessible à tous, licenciés ou non, joueurs loisirs et compétiteurs, nous vous proposons de nombreux services pour faciliter votre pratique :
          </p>
          <ul className="space-y-3 text-white list-none">
            {[
              "trouver un club et souscrire à ses offres",
              "réserver un terrain dans votre club ou louer un court dans un autre club",
              "suivre vos performances et votre classement tout au long de l'année",
              "s'inscrire à des tournois partout en France",
              "retrouver tous les avantages des licenciés"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Search Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Rechercher</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button
              variant="secondary"
              className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white border-2 border-yellow-300/50"
            >
              <Court className="h-8 w-8" />
              <span>Court à louer</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white"
            >
              <Users2 className="h-8 w-8" />
              <span>Club</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white"
            >
              <Trophy className="h-8 w-8" />
              <span>Compétition</span>
            </Button>
            <Button
              variant="secondary"
              className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white"
            >
              <Users2 className="h-8 w-8" />
              <span>Championnat par équipe</span>
            </Button>
          </div>

          <SearchHeader onSearch={handleSearch} />
          <FilterBar 
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>

        {/* Results Section */}
        <div className="space-y-4 animate-slide-in">
          {isLoading ? (
            <div className="text-center py-8 text-white">Loading leagues...</div>
          ) : data && data.length > 0 ? (
            <>
              {data.map((league) => (
                <ResultCard
                  key={league.id}
                  id={league.id}
                  title={league.name}
                  location={league.location}
                  distance={0}
                  date={format(new Date(league.start_date), 'MMMM d, yyyy')}
                  type={league.format}
                  sportType={league.sport_type}
                  skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
                  genderCategory={league.gender_category}
                  participants={league.max_participants}
                />
              ))}
              {!selectedLeagueId && (
                <div className="flex justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.length < LEAGUES_PER_PAGE}
                    className="bg-white/10 text-white hover:bg-white/20"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-white">
              No leagues found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;