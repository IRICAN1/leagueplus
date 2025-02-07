
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDuoLeagueDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['duo-league', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('duo_leagues')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });
};
