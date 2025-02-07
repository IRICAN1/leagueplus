
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLeagueDetails = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ['league', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled
  });
};
