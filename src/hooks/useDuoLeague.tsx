
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDuoLeague = (id: string | undefined) => {
  return useQuery({
    queryKey: ['duo-league', id],
    queryFn: async () => {
      if (!id) throw new Error('Invalid league ID');

      const { data, error } = await supabase
        .from('duo_leagues')
        .select(`
          *,
          creator:creator_id (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('League not found');

      return {
        ...data,
        format: 'Team' as const,
        is_doubles: true,
        max_participants: data.max_duo_pairs * 2,
        requires_duo: true
      };
    },
    retry: 1
  });
};
