import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DuoSearchFilters } from "@/components/duo-search/DuoSearchFilters";
import { PlayerResultCard } from "@/components/duo-search/PlayerResultCard";
import { ActiveDuosList } from "@/components/duo-search/ActiveDuosList";
import { PendingInvites } from "@/components/duo-search/PendingInvites";
import { DuoSearchHeader } from "@/components/duo-search/DuoSearchHeader";
import { DuoSearchTabs } from "@/components/duo-search/DuoSearchTabs";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export type DuoSearchFilters = {
  skillLevel?: string;
  availability?: string[];
  location?: string;
  gender?: string;
  ageCategory?: string;
};

const DuoSearch = () => {
  const [filters, setFilters] = useState<DuoSearchFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'myDuos' | 'search'>('myDuos');

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

  // Auto-switch to search tab if no duos exist
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

      // Apply text search on full_name or username
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
  };

  const handleFilterReset = () => {
    setFilters({});
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <DuoSearchTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'search' && (
            <div className="space-y-6 animate-fade-in">
              <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 border border-blue-100">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <DuoSearchHeader 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFilterReset}
                    className="hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                    title="Reset filters"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <DuoSearchFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </div>

              <div className="space-y-3">
                {playersLoading ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading players...
                  </div>
                ) : players && players.length > 0 ? (
                  players.map((player) => (
                    <PlayerResultCard
                      key={player.id}
                      player={player}
                      className="animate-slide-in"
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                    No players found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'myDuos' && (
            <div className="animate-fade-in">
              {!duosLoading && (!duos || duos.length === 0) ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm text-center">
                  <h2 className="text-xl font-semibold mb-2">No Active Partnerships</h2>
                  <p className="text-gray-600 mb-4">
                    Start searching for duo partners to create new partnerships!
                  </p>
                  <Button
                    onClick={() => setActiveTab('search')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    Find Partners
                  </Button>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                  <ActiveDuosList
                    duos={duos || []}
                    isLoading={duosLoading}
                    onDuoUpdated={() => {
                      // Refetch queries
                    }}
                  />
                </div>
              )}

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuoSearch;
