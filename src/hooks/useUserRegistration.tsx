
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type DuoLeagueParticipant = {
  id: string;
  league_id: string;
  player_id: string;
};

export const useUserRegistration = (id: string | undefined, userId: string | null) => {
  return useQuery({
    queryKey: ['isUserRegisteredDuo', id, userId],
    queryFn: async () => {
      if (!userId || !id) return false;
      
      const { data, error } = await supabase
        .from('duo_league_participants')
        .select('id')
        .eq('league_id', id)
        .eq('player_id', userId)
        .maybeSingle<DuoLeagueParticipant>();

      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!id
  });
};
