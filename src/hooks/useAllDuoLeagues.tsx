
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllDuoLeagues = (page = 1, limit = 10, showAll = false) => {
  return useQuery({
    queryKey: ['all-duo-leagues', page, limit, showAll],
    queryFn: async () => {
      console.log("Fetching all duo leagues...");
      
      // Create a simple query that selects all data from duo_leagues
      let query = supabase
        .from('duo_leagues')
        .select('*');

      // We still want to count the total records
      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching duo leagues:", error);
        throw error;
      }

      // Log the full response to see what we're getting
      console.log("Raw duo leagues data:", data);
      
      // Now fetch the participation count for each league in a separate query
      if (data && data.length > 0) {
        const leaguesWithParticipants = await Promise.all(
          data.map(async (league) => {
            const { data: participants, error: participantsError } = await supabase
              .from('duo_league_participants')
              .select('id')
              .eq('league_id', league.id);
              
            if (participantsError) {
              console.error("Error fetching participants:", participantsError);
              return {
                ...league,
                duo_league_participants: []
              };
            }
            
            return {
              ...league,
              duo_league_participants: participants || []
            };
          })
        );
        
        console.log("Processed duo leagues with participants:", leaguesWithParticipants);
        
        return {
          leagues: leaguesWithParticipants || [],
          totalCount: leaguesWithParticipants.length,
          totalPages: 1
        };
      }
      
      return {
        leagues: data || [],
        totalCount: data?.length || 0,
        totalPages: 1
      };
    },
  });
};
