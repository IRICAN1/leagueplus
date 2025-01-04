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
    setPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (newFilters: Partial<LeagueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedLeagueId(null); // Clear selected league when filters change
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container max-w-4xl mx-auto py-4 md:py-8 space-y-6 px-4">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text">
            Find Competitions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sports competitions near you and join the excitement
          </p>
        </div>

        <SearchHeader onSearch={handleSearch} />
        <FilterBar 
          onFilterChange={handleFilterChange}
          filters={filters}
        />

        <div className="space-y-4 animate-slide-in">
          {isLoading ? (
            <div className="text-center py-8 text-gray-600">Loading leagues...</div>
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
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={data.length < LEAGUES_PER_PAGE}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No leagues found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;