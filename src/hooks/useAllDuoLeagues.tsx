
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAllDuoLeagues = (page = 1, limit = 10, showAll = false) => {
  return useQuery({
    queryKey: ['all-duo-leagues', page, limit, showAll],
    queryFn: async () => {
      let query = supabase
        .from('duo_leagues')
        .select(`
          *,
          duo_league_participants (
            id
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      // Only apply pagination if not showing all
      if (!showAll) {
        // Calculate the range for pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        leagues: data || [],
        totalCount: count || 0,
        totalPages: count && !showAll ? Math.ceil(count / limit) : 1
      };
    },
  });
};
