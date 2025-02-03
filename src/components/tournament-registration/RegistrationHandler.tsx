import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DuoSelectionDialog } from "./DuoSelectionDialog";
import { toast } from "sonner";

interface RegistrationHandlerProps {
  leagueId: string;
  isDoubles?: boolean;
  requirements?: {
    skillLevel?: string;
    ageCategory?: string;
    genderCategory?: "Men" | "Women" | "Mixed";
  };
}

export const RegistrationHandler = ({
  leagueId,
  isDoubles,
  requirements,
}: RegistrationHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [duos, setDuos] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDuos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is already registered
        const { data: existingRegistrations } = await supabase
          .from('duo_league_participants')
          .select('duo_partnership_id')
          .eq('league_id', leagueId);

        const registeredDuoIds = existingRegistrations?.map(reg => reg.duo_partnership_id) || [];

        // Base query for partnerships where user is either player1 or player2
        let query = supabase
          .from('duo_partnerships')
          .select(`
            *,
            player1:profiles!duo_partnerships_player1_id_fkey(*),
            player2:profiles!duo_partnerships_player2_id_fkey(*),
            duo_statistics(*)
          `)
          .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
          .eq('active', true);

        // Only add the not.in filter if there are registered duos
        if (registeredDuoIds.length > 0) {
          query = query.not('id', 'in', registeredDuoIds);
        }

        const { data: partnerships, error } = await query;

        if (error) throw error;

        // Transform the data to show the partner's information
        const transformedPartnerships = partnerships?.map(partnership => ({
          ...partnership,
          // Set partner based on which player the current user is
          partner: user.id === partnership.player1_id ? partnership.player2 : partnership.player1
        })) || [];

        setDuos(transformedPartnerships);
      } catch (error) {
        console.error('Error fetching duos:', error);
        toast.error("Failed to fetch duo partnerships");
      }
    };

    fetchDuos();
  }, [leagueId]);

  const handleRegistration = async (duoId: string) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to register");
        return;
      }

      // Check if the tournament exists and get its details
      const { data: tournament } = await supabase
        .from('duo_leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (!tournament) {
        toast.error("Tournament not found");
        return;
      }

      // Check if registration is still open
      if (new Date(tournament.registration_deadline) < new Date()) {
        toast.error("Registration deadline has passed");
        return;
      }

      // Check if the tournament is full
      const { count } = await supabase
        .from('duo_league_participants')
        .select('*', { count: 'exact' })
        .eq('league_id', leagueId);

      if (count && tournament.max_duo_pairs && count >= tournament.max_duo_pairs) {
        toast.error("Tournament is full");
        return;
      }

      // Register the duo
      const { error: registrationError } = await supabase
        .from('duo_league_participants')
        .insert({
          league_id: leagueId,
          duo_partnership_id: duoId,
        });

      if (registrationError) throw registrationError;

      toast.success("Successfully registered for the tournament");
      navigate(`/tournament/${leagueId}`);
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Failed to register for the tournament");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DuoSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        duos={duos}
        onSelect={handleRegistration}
        leagueRequirements={{
          skillLevel: requirements?.skillLevel,
          ageCategory: requirements?.ageCategory,
          genderCategory: requirements?.genderCategory,
        }}
      />
    </>
  );
};