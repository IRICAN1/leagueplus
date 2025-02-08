
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type DuoLeagueParticipant = Database['public']['Tables']['duo_league_participants']['Row'];

export const useUserRegistration = (id: string | undefined, userId: string | null) => {
  return useQuery({
    queryKey: ['isUserRegisteredDuo', id, userId],
    queryFn: async () => {
      if (!userId || !id) return false;
      
      const { data, error } = await supabase
        .from('duo_league_participants')
        .select('*')
        .eq('league_id', id)
        .eq('duo_partnership_id', 
          supabase
            .from('duo_partnerships')
            .select('id')
            .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
            .eq('active', true)
        )
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!id
  });
};
