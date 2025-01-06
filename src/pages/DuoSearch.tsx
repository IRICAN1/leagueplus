import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DuoSearchFilters } from "@/components/duo-search/DuoSearchFilters";
import { PlayerResultCard } from "@/components/duo-search/PlayerResultCard";
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

  const { data: players, isLoading } = useQuery({
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

      if (filters.location) {
        query = query.eq('primary_location', filters.location);
      }
      if (filters.gender) {
        query = query.eq('gender', filters.gender);
      }
      if (filters.skillLevel) {
        const [min, max] = filters.skillLevel.split('-').map(Number);
        query = query.gte('skill_level', min).lte('skill_level', max);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Failed to fetch players");
        throw error;
      }

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
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-transparent bg-clip-text">
              Find Your Perfect Duo Partner
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search for players that match your style and schedule
            </p>
          </div>

          <DuoSearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-600">
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
              <div className="text-center py-8 text-gray-600">
                No players found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuoSearch;