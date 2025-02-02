import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DuoSelectionDialog } from "./DuoSelectionDialog";
import { toast } from "sonner";

interface RegistrationHandlerProps {
  tournamentId: string;
  skillLevel?: string;
  ageCategory?: string;
  genderCategory?: string;
}

export const RegistrationHandler = ({
  tournamentId,
  skillLevel,
  ageCategory,
  genderCategory,
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
          .eq('league_id', tournamentId);

        const registeredDuoIds = existingRegistrations?.map(reg => reg.duo_partnership_id) || [];

        // Fetch partnerships where the user is either player1 or player2
        const { data: partnerships, error } = await supabase
          .from('duo_partnerships')
          .select(`
            *,
            player1:player1_id(id, username, avatar_url),
            player2:player2_id(id, username, avatar_url),
            duo_statistics(*)
          `)
          .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
          .eq('active', true)
          .not('id', 'in', registeredDuoIds.length > 0 ? `(${registeredDuoIds.join(',')})` : '(null)');

        if (error) throw error;

        // Transform the data to show the partner's information
        const transformedPartnerships = partnerships?.map(partnership => ({
          ...partnership,
          partner: user.id === partnership.player1_id ? partnership.player2 : partnership.player1
        })) || [];

        setDuos(transformedPartnerships);
      } catch (error) {
        console.error('Error fetching duos:', error);
        toast.error("Failed to fetch duo partnerships");
      }
    };

    fetchDuos();
  }, [tournamentId]);

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
        .eq('id', tournamentId)
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
        .eq('league_id', tournamentId);

      if (count && tournament.max_duo_pairs && count >= tournament.max_duo_pairs) {
        toast.error("Tournament is full");
        return;
      }

      // Register the duo
      const { error: registrationError } = await supabase
        .from('duo_league_participants')
        .insert({
          league_id: tournamentId,
          duo_partnership_id: duoId,
        });

      if (registrationError) throw registrationError;

      toast.success("Successfully registered for the tournament");
      navigate(`/tournament/${tournamentId}`);
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
          skillLevel,
          ageCategory,
          genderCategory,
        }}
      />
    </>
  );
};