
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRankingsData = (leagueId: string) => {
  return useQuery({
    queryKey: ['global-rankings', leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duo_league_participants')
        .select(`
          duo_partnership:duo_partnerships!inner (
            id,
            player1:profiles!duo_partnerships_player1_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              primary_location,
              skill_level,
              gender
            ),
            player2:profiles!duo_partnerships_player2_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              primary_location,
              skill_level,
              gender
            )
          )
        `)
        .eq('league_id', leagueId);

      if (error) throw error;
      
      // Get all partnership IDs to fetch stats
      const partnershipIds = data.map(item => item.duo_partnership.id);
      
      // Fetch all statistics in a separate query
      const { data: statsData, error: statsError } = await supabase
        .from('duo_statistics')
        .select('*')
        .in('partnership_id', partnershipIds);
        
      if (statsError) throw statsError;
      
      // Create a map for easy lookup
      const statsMap = new Map();
      statsData?.forEach(stat => {
        statsMap.set(stat.partnership_id, stat);
      });
      
      const processedData = data.map(item => {
        const partnership = item.duo_partnership;
        // Look up stats or use default values
        const stats = statsMap.get(partnership.id) || { 
          wins: 0, 
          losses: 0, 
          points: 0, 
          rank: 999999 
        };
        
        return {
          id: partnership.id,
          player1: {
            id: partnership.player1.id,
            name: partnership.player1.full_name || partnership.player1.username || 'Unknown',
            avatar: partnership.player1.avatar_url,
            location: partnership.player1.primary_location
          },
          player2: {
            id: partnership.player2.id,
            name: partnership.player2.full_name || partnership.player2.username || 'Unknown',
            avatar: partnership.player2.avatar_url,
            location: partnership.player2.primary_location
          },
          stats: {
            rank: stats.rank || 999999,
            wins: stats.wins || 0,
            losses: stats.losses || 0,
            points: stats.points || 0,
            matchesPlayed: (stats.wins || 0) + (stats.losses || 0),
            winRate: (stats.wins || 0) + (stats.losses || 0) > 0 
              ? Math.round((stats.wins || 0) / ((stats.wins || 0) + (stats.losses || 0)) * 100) 
              : 0
          }
        };
      });
      
      const pointsSorted = [...processedData].sort((a, b) => b.stats.points - a.stats.points || a.stats.rank - b.stats.rank);
      const matchesSorted = [...processedData].sort((a, b) => b.stats.matchesPlayed - a.stats.matchesPlayed);
      const winRateSorted = [...processedData]
        .filter(player => player.stats.matchesPlayed > 0)
        .sort((a, b) => b.stats.winRate - a.stats.winRate);
      
      return {
        byPoints: pointsSorted,
        byMatches: matchesSorted,
        byWinRate: winRateSorted,
        all: processedData // Include all players for complete reference
      };
    }
  });
};
