import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DuoSearchFilters } from "@/components/duo-search/DuoSearchFilters";
import { PlayerResultCard } from "@/components/duo-search/PlayerResultCard";
import { ActiveDuosList } from "@/components/duo-search/ActiveDuosList";
import { PendingInvites } from "@/components/duo-search/PendingInvites";
import { DuoSearchHeader } from "@/components/duo-search/DuoSearchHeader";
import { DuoSearchTabs } from "@/components/duo-search/DuoSearchTabs";

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
  const [activeTab, setActiveTab] = useState<'search' | 'myDuos'>('search');

  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ['duo-search', filters],
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

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  const { data: duos, isLoading: duosLoading } = useQuery({
    queryKey: ['active-duos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duo_partnerships')
        .select(`
          *,
          player1:player1_id (id, username, avatar_url),
          player2:player2_id (id, username, avatar_url),
          duo_statistics (*)
        `)
        .eq('active', true);

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
          sender:sender_id (id, username, avatar_url),
          receiver:receiver_id (id, username, avatar_url)
        `)
        .eq('status', 'pending');

      if (error) throw error;
      return data || [];
    },
  });

  const handleFilterChange = (newFilters: DuoSearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <DuoSearchHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <DuoSearchTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'search' && (
            <div className="space-y-6 animate-fade-in">
              <DuoSearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              <div className="space-y-4">
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
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Pending Invites</h2>
                <PendingInvites
                  invites={pendingInvites || []}
                  isLoading={invitesLoading}
                  onInviteUpdated={() => {
                    // Refetch queries
                  }}
                />
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Active Partnerships</h2>
                <ActiveDuosList
                  duos={duos || []}
                  isLoading={duosLoading}
                  onDuoUpdated={() => {
                    // Refetch queries
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DuoSearch;