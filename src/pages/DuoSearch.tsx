import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DuoSearchFilters } from "@/components/duo-search/DuoSearchFilters";
import { PlayerResultCard } from "@/components/duo-search/PlayerResultCard";
import { ActiveDuosList } from "@/components/duo-search/ActiveDuosList";
import { PendingInvites } from "@/components/duo-search/PendingInvites";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
        toast.error("Failed to fetch players");
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
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Tennis Duo System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find your perfect tennis partner or manage your existing partnerships
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 mb-6">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'search' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              onClick={() => setActiveTab('search')}
            >
              Find Partners
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'myDuos' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              onClick={() => setActiveTab('myDuos')}
            >
              My Duos
            </button>
          </div>

          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-12"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600">
                  <Search className="h-5 w-5" />
                </button>
              </div>

              <DuoSearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {playersLoading ? (
                  <div className="col-span-full text-center py-8 text-gray-600">
                    Loading players...
                  </div>
                ) : players && players.length > 0 ? (
                  players.map((player) => (
                    <PlayerResultCard
                      key={player.id}
                      player={player}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-600">
                    No players found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'myDuos' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Pending Invites</h2>
                <PendingInvites
                  invites={pendingInvites || []}
                  isLoading={invitesLoading}
                  onInviteUpdated={() => {
                    // Refetch queries
                  }}
                />
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
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