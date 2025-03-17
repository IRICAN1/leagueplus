
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllDuoLeagues = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['all-duo-leagues', page, limit],
    queryFn: async () => {
      // Calculate the range for pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('duo_leagues')
        .select(`
          *,
          duo_league_participants (
            id
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      return {
        leagues: data || [],
        totalCount: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0
      };
    },
  });
};
