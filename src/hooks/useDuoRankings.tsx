
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/components/tournament/types";

export const useDuoRankings = (id: string | undefined) => {
  const { data: duoRankings } = useQuery({
    queryKey: ['duo-rankings', id],
    queryFn: async () => {
      if (!id) return null;

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
            ),
            duo_statistics (
              wins,
              losses
            )
          )
        `)
        .eq('league_id', id);

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const processedRankings: Player[] = duoRankings?.map((participant, index) => ({
    id: participant.duo_partnership.id,
    name: `${participant.duo_partnership.player1?.full_name || participant.duo_partnership.player1?.username || 'Unknown'} & ${participant.duo_partnership.player2?.full_name || participant.duo_partnership.player2?.username || 'Unknown'}`,
    avatar_url: participant.duo_partnership.player1?.avatar_url,
    avatar_url2: participant.duo_partnership.player2?.avatar_url,
    rank: index + 1,
    wins: participant.duo_partnership.duo_statistics[0]?.wins || 0,
    losses: participant.duo_partnership.duo_statistics[0]?.losses || 0,
    matches_played: (participant.duo_partnership.duo_statistics[0]?.wins || 0) + 
                   (participant.duo_partnership.duo_statistics[0]?.losses || 0),
    points: 0
  })) || [];

  return { processedRankings };
};
