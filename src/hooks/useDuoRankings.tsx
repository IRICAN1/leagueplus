
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "@/components/tournament/types";

export const useDuoRankings = (id: string | undefined) => {
  const { data: duoRankings } = useQuery({
    queryKey: ['duo-rankings', id],
    queryFn: async () => {
      if (!id) return null;

      // Get all participants in the league - the query should return ALL partnerships
      const { data: participants, error: participantsError } = await supabase
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
              losses,
              points,
              rank
            )
          )
        `)
        .eq('league_id', id);

      if (participantsError) {
        console.error("Error fetching duo participants:", participantsError);
        throw participantsError;
      }

      console.log("Fetched duo participants:", participants?.length);

      // Process the participants data
      const processedRankings = participants?.map(participant => {
        const partnership = participant.duo_partnership;
        const stats = partnership.duo_statistics[0] || {
          wins: 0,
          losses: 0,
          points: 0,
          rank: 999999
        };

        return {
          id: partnership.id,
          name: `${partnership.player1.full_name || partnership.player1.username || 'Unknown'} & ${partnership.player2.full_name || partnership.player2.username || 'Unknown'}`,
          avatar_url: partnership.player1.avatar_url,
          avatar_url2: partnership.player2.avatar_url,
          rank: stats.rank || 999999,
          wins: stats.wins || 0,
          losses: stats.losses || 0,
          matches_played: (stats.wins || 0) + (stats.losses || 0),
          points: stats.points || 0,
          player1_id: partnership.player1.id,
          player2_id: partnership.player2.id,
          primary_location: partnership.player1.primary_location,
          skill_level: partnership.player1.skill_level,
          gender: partnership.player1.gender
        };
      }) || [];

      // Sort by rank
      return processedRankings.sort((a, b) => (a.rank || 999999) - (b.rank || 999999));
    },
    enabled: !!id
  });

  return { processedRankings: duoRankings || [] };
};
