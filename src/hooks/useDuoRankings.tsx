
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/components/tournament/types";

export const useDuoRankings = (id: string | undefined) => {
  const { data: duoRankings } = useQuery({
    queryKey: ['duo-rankings', id],
    queryFn: async () => {
      if (!id) return null;

      const { data: rankings, error } = await supabase
        .rpc('get_duo_rankings', {
          league_id_param: id
        });

      if (error) throw error;

      const { data: stats, error: statsError } = await supabase
        .from('duo_statistics')
        .select('*')
        .in('partnership_id', rankings.map(r => r.partnership_id));

      if (statsError) throw statsError;

      // Combine rankings with statistics
      const processedRankings = rankings.map(partnership => {
        const partnershipStats = stats.find(s => s.partnership_id === partnership.partnership_id) || {
          wins: 0,
          losses: 0,
          points: 0,
          rank: 999999
        };

        return {
          ...partnership,
          ...partnershipStats
        };
      });

      return processedRankings;
    },
    enabled: !!id
  });

  const processedRankings: Player[] = duoRankings?.map((partnership) => ({
    id: partnership.partnership_id,
    name: `${partnership.player1_full_name || partnership.player1_username || 'Unknown'} & ${partnership.player2_full_name || partnership.player2_username || 'Unknown'}`,
    avatar_url: partnership.player1_avatar_url,
    avatar_url2: partnership.player2_avatar_url,
    rank: partnership.rank || 999999,
    wins: partnership.wins || 0,
    losses: partnership.losses || 0,
    matches_played: (partnership.wins || 0) + (partnership.losses || 0),
    points: partnership.points || 0,
    primary_location: partnership.player1_primary_location,
    skill_level: partnership.player1_skill_level,
    gender: partnership.player1_gender
  })) || [];

  return { processedRankings };
};
