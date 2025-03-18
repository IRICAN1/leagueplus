
import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { LeagueTypeSelector } from "@/components/leagues/LeagueTypeSelector";
import { LeaguesList } from "@/components/leagues/LeaguesList";
import { LeagueGlobalRankingPreview } from "@/components/leagues/LeagueGlobalRankingPreview";
import { LeagueType, LeagueFilters, DuoLeague, IndividualLeague, isDuoLeague } from "@/types/league";
import { PublicDuoLeaguesList } from "@/components/leagues/PublicDuoLeaguesList";
import { useAllDuoLeagues } from "@/hooks/useAllDuoLeagues";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LEAGUES_PER_PAGE = 10;

const Index = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeagueFilters>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [leagueType, setLeagueType] = useState<LeagueType>('duo');
  const [activeTab, setActiveTab] = useState<'leagues' | 'duos'>('duos'); // Set duos as default

  // Query for standard leagues
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
        .order('sport_type', { ascending: false })
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

      let filteredData = data as (DuoLeague | IndividualLeague)[];
      if (filters.hasSpots) {
        filteredData = filteredData.filter(league => {
          const participantCount = isDuoLeague(league) 
            ? league.duo_league_participants.length 
            : league.league_participants.length;
          const maxParticipants = isDuoLeague(league) 
            ? league.max_duo_pairs 
            : league.max_participants;
          return participantCount < maxParticipants;
        });
      }

      return filteredData;
    },
    enabled: activeTab === 'leagues',
  });

  // Get all duo leagues for the public display - now with showAll parameter
  const { 
    data: duoLeaguesData, 
    isLoading: duoLeaguesLoading 
  } = useAllDuoLeagues(page, LEAGUES_PER_PAGE, true); // Set showAll to true

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

  const handleTabChange = (tab: 'leagues' | 'duos') => {
    setActiveTab(tab);
    setSelectedLeagueId(null);
    setPage(1);
  };

  // Add console logs to debug the data
  console.log("Duo leagues data:", duoLeaguesData);

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

        {activeTab === 'leagues' && (
          <LeagueTypeSelector 
            leagueType={leagueType} 
            onLeagueTypeChange={setLeagueType} 
          />
        )}

        <SearchHeader 
          onSearch={handleSearch} 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === 'leagues' && (
          <FilterBar 
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        )}

        {activeTab === 'duos' && (
          <div className="flex justify-center mb-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/all-duo-leagues">View All Duo Tournaments</Link>
            </Button>
          </div>
        )}

        {selectedLeagueId && (
          <div className="mb-6">
            <LeagueGlobalRankingPreview 
              leagueId={selectedLeagueId} 
              leagueType={activeTab === 'duos' ? 'duo' : leagueType} 
            />
          </div>
        )}

        {activeTab === 'leagues' ? (
          <LeaguesList
            data={data || []}
            isLoading={isLoading}
            leagueType={leagueType}
            selectedLeagueId={selectedLeagueId}
            page={page}
            onPageChange={setPage}
            itemsPerPage={LEAGUES_PER_PAGE}
          />
        ) : (
          <PublicDuoLeaguesList
            leagues={duoLeaguesData?.leagues || []}
            isLoading={duoLeaguesLoading}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            showPagination={false}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
