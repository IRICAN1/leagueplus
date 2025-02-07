
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/components/tournament/types";

export const useDuoRankings = (id: string | undefined) => {
  const { data: duoRankings } = useQuery({
    queryKey: ['duo-rankings', id],
    queryFn: async () => {
      if (!id) return null;

      console.log("Fetching duo rankings for league:", id);

      const { data: participants, error } = await supabase
        .from('duo_league_participants')
        .select(`
          id,
          duo_partnership:duo_partnerships!inner (
            id,
            player1:profiles!duo_partnerships_player1_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            ),
            player2:profiles!duo_partnerships_player2_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            ),
            duo_statistics (
              wins,
              losses
            )
          )
        `)
        .eq('league_id', id);

      if (error) {
        console.error('Error fetching duo rankings:', error);
        throw error;
      }

      console.log("Fetched participants:", participants);
      return participants;
    },
    enabled: !!id
  });

  const processedRankings: Player[] = duoRankings?.map((participant, index) => {
    const partnership = participant.duo_partnership;
    const stats = partnership.duo_statistics[0] || { wins: 0, losses: 0 };
    
    return {
      id: partnership.id,
      name: `${partnership.player1?.username || 'Unknown'} & ${partnership.player2?.username || 'Unknown'}`,
      avatar_url: partnership.player1?.avatar_url,
      avatar_url2: partnership.player2?.avatar_url,
      rank: index + 1,
      wins: stats.wins || 0,
      losses: stats.losses || 0,
      matches_played: (stats.wins || 0) + (stats.losses || 0),
      points: 0  // We'll calculate this based on wins/losses if needed
    };
  }) || [];

  return { processedRankings };
};
