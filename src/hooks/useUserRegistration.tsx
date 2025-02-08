
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type DuoLeagueParticipant = Database['public']['Tables']['duo_league_participants']['Row'];

export const useUserRegistration = (id: string | undefined, userId: string | null) => {
  return useQuery({
    queryKey: ['isUserRegisteredDuo', id, userId],
    queryFn: async () => {
      if (!userId || !id) return false;
      
      // First get the user's active duo partnerships
      const { data: partnerships } = await supabase
        .from('duo_partnerships')
        .select('id')
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
        .eq('active', true)
        .throwOnError();

      if (!partnerships || partnerships.length === 0) return false;

      // Then check if any of these partnerships are registered in the league
      const { data: registration } = await supabase
        .from('duo_league_participants')
        .select()
        .eq('league_id', id)
        .in('duo_partnership_id', partnerships.map(p => p.id))
        .maybeSingle()
        .throwOnError();

      return !!registration;
    },
    enabled: !!userId && !!id
  });
};
