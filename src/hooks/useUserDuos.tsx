
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUserDuos = (shouldFetch: boolean) => {
  const [duos, setDuos] = useState<any[]>([]);
  const [isLoadingDuos, setIsLoadingDuos] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDuos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: partnerships, error } = await supabase
          .from('duo_partnerships')
          .select(`
            *,
            player2:profiles!duo_partnerships_player2_id_fkey(*),
            duo_statistics(*)
          `)
          .eq('player1_id', user.id);

        if (error) throw error;
        setDuos(partnerships || []);
      } catch (error) {
        console.error('Error fetching duos:', error);
        toast({
          title: "Error",
          description: "Failed to fetch duo partnerships",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDuos(false);
      }
    };

    if (shouldFetch) {
      fetchDuos();
    }
  }, [shouldFetch, toast]);

  return { duos, isLoadingDuos };
};
