
import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { ResultCard } from "@/components/ResultCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Database } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Users, User } from "lucide-react";

const LEAGUES_PER_PAGE = 10;

export type LeagueFilters = {
  location?: string;
  sportType?: Database['public']['Enums']['league_sport_type'];
  skillLevel?: string;
  genderCategory?: Database['public']['Enums']['league_gender_category'];
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'upcoming' | 'completed';
  hasSpots?: boolean;
};

type LeagueType = 'individual' | 'duo';

const calculateLeagueStatus = (startDate: string, endDate: string): 'active' | 'upcoming' | 'completed' => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
};

const Index = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeagueFilters>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [leagueType, setLeagueType] = useState<LeagueType>('duo'); // Set default to 'duo'

  const { data, isLoading, error } = useQuery({
    queryKey: ['leagues', page, filters, selectedLeagueId, leagueType],
    queryFn: async () => {
      const tableName = leagueType === 'individual' ? 'leagues' : 'duo_leagues';
      const participantsTable = leagueType === 'individual' ? 'league_participants' : 'duo_league_participants';
      
      let query = supabase
        .from(tableName)
        .select(`
          *,
          ${participantsTable} (
            id
          )
        `)
        .order('sport_type', { ascending: false }) // Put Padel first
        .order('created_at', { ascending: false });

      if (selectedLeagueId) {
        query = query.eq('id', selectedLeagueId);
      } else {
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

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Filter leagues with available spots in memory
      let filteredData = data;
      if (filters.hasSpots) {
        filteredData = data.filter(league => {
          const participantCount = league[participantsTable]?.length || 0;
          const maxParticipants = leagueType === 'individual' ? league.max_participants : league.max_duo_pairs;
          return participantCount < maxParticipants;
        });
      }

      return filteredData;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container max-w-4xl mx-auto py-4 md:py-8 space-y-6 px-4 mt-16 md:mt-20">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text">
            Serve, Smash, Conquer!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thrilling Padel and Badminton leagues - Where every match is an adventure
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={leagueType === 'duo' ? 'default' : 'outline'}
            onClick={() => setLeagueType('duo')}
            className="relative overflow-hidden transition-all duration-300"
          >
            <Users className="h-4 w-4 mr-2" />
            Duo Leagues
            {leagueType === 'duo' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
            )}
          </Button>
          <Button
            variant={leagueType === 'individual' ? 'default' : 'outline'}
            onClick={() => setLeagueType('individual')}
            className="relative overflow-hidden transition-all duration-300"
          >
            <User className="h-4 w-4 mr-2" />
            Individual Leagues
            {leagueType === 'individual' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
            )}
          </Button>
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
                  type={calculateLeagueStatus(league.start_date, league.end_date)}
                  sportType={league.sport_type}
                  skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
                  genderCategory={league.gender_category}
                  participants={leagueType === 'individual' ? league.max_participants : league.max_duo_pairs}
                  format={leagueType === 'duo' ? 'Team' : 'Individual'}
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
