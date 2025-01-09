import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActiveDuosList } from "@/components/duo-search/ActiveDuosList";
import { PendingInvites } from "@/components/duo-search/PendingInvites";
import { DuoSearchTabs } from "@/components/duo-search/DuoSearchTabs";
import { SearchSection } from "@/components/duo-search/SearchSection";
import { ResultsSection } from "@/components/duo-search/ResultsSection";

export type DuoSearchFilters = {
  skillLevel?: string;
  availability?: string[];
  location?: string;
  gender?: string;
  ageCategory?: string;
};

const PLAYERS_PER_PAGE = 5;

const DuoSearch = () => {
  const [filters, setFilters] = useState<DuoSearchFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'myDuos' | 'search'>('myDuos');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: duos, isLoading: duosLoading } = useQuery({
    queryKey: ['active-duos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duo_partnerships')
        .select(`
          *,
          player1:player1_id (id, username, avatar_url, full_name),
          player2:player2_id (id, username, avatar_url, full_name),
          duo_statistics (*)
        `)
        .eq('active', true);

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (!duosLoading && (!duos || duos.length === 0)) {
      setActiveTab('search');
    }
  }, [duos, duosLoading]);

  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ['duo-search', filters, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          player_statistics (
            rank,
            wins,
            losses,
            points
          )
        `);

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`);
      }

      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }

      if (filters.ageCategory) {
        query = query.eq('age_category', filters.ageCategory);
      }

      if (filters.skillLevel) {
        const [min, max] = filters.skillLevel.split('-').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          query = query
            .gte('skill_level', min)
            .lte('skill_level', max);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });

  const { data: pendingInvites, isLoading: invitesLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duo_invites')
        .select(`
          *,
          sender:sender_id (id, username, avatar_url, full_name),
          receiver:receiver_id (id, username, avatar_url, full_name)
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data || [];
    },
  });

  const handleFilterChange = (newFilters: DuoSearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleFilterReset = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPlayers = players?.length || 0;
  const totalPages = Math.ceil(totalPlayers / PLAYERS_PER_PAGE);
  const startIndex = (currentPage - 1) * PLAYERS_PER_PAGE;
  const endIndex = startIndex + PLAYERS_PER_PAGE;
  const currentPlayers = players?.slice(startIndex, endIndex) || [];

  // Show filters only when there are results or active filters
  useEffect(() => {
    setShowFilters(
      Boolean(searchQuery) || 
      Object.values(filters).some(value => value !== undefined) ||
      (players && players.length > 0)
    );
  }, [searchQuery, filters, players]);

  return (
    <div className="min-h-screen pt-4 md:pt-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <DuoSearchTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'search' ? (
            <div className="space-y-6 animate-fade-in">
              <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleFilterReset={handleFilterReset}
                showFilters={showFilters}
              />
              <ResultsSection
                players={currentPlayers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                playersLoading={playersLoading}
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              {!duosLoading && (!duos || duos.length === 0) ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm text-center">
                  <h2 className="text-xl font-semibold mb-2">No Active Partnerships</h2>
                  <p className="text-gray-600 mb-4">
                    Start searching for duo partners to create new partnerships!
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    Find Partners
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                    <ActiveDuosList
                      duos={duos || []}
                      isLoading={duosLoading}
                      onDuoUpdated={() => {
                        // Refetch queries
                      }}
                    />
                  </div>

                  {pendingInvites && pendingInvites.length > 0 && (
                    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Pending Invites
                      </h2>
                      <PendingInvites
                        invites={pendingInvites}
                        isLoading={invitesLoading}
                        onInviteUpdated={() => {
                          // Refetch queries
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuoSearch;
