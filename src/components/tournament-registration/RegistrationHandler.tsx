
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DuoSelectionDialog } from "./DuoSelectionDialog";
import { toast } from "sonner";
import { RegistrationButton } from "./RegistrationButton";

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
  const [canRegister, setCanRegister] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkPlayerDuos = async (playerId: string) => {
    try {
      const { data: partnerships, error } = await supabase
        .from('duo_partnerships')
        .select('*')
        .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`)
        .eq('active', true);

      if (error) {
        console.error('Error checking duo partnerships:', error);
        return false;
      }

      return partnerships && partnerships.length > 0;
    } catch (error) {
      console.error('Error in checkPlayerDuos:', error);
      return false;
    }
  };

  const verifyRegistrationEligibility = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to register");
        return false;
      }

      // Check if the user has any active duo partnerships
      const hasDuos = await checkPlayerDuos(user.id);
      if (!hasDuos) {
        toast.error("You need to have an active duo partnership to register for this tournament");
        return false;
      }

      // Check if the tournament exists and get its details
      const { data: tournament } = await supabase
        .from('duo_leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (!tournament) {
        toast.error("Tournament not found");
        return false;
      }

      // Check if registration is still open
      if (new Date(tournament.registration_deadline) < new Date()) {
        toast.error("Registration deadline has passed");
        return false;
      }

      // Check if the tournament is full
      const { count } = await supabase
        .from('duo_league_participants')
        .select('*', { count: 'exact' })
        .eq('league_id', leagueId);

      if (count && tournament.max_duo_pairs && count >= tournament.max_duo_pairs) {
        toast.error("Tournament is full");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking registration eligibility:', error);
      toast.error("Failed to verify registration eligibility");
      return false;
    }
  };

  useEffect(() => {
    const checkEligibility = async () => {
      const isEligible = await verifyRegistrationEligibility();
      setCanRegister(isEligible);
    };
    
    checkEligibility();
  }, [leagueId]);

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

        // Add the not.in filter only if there are registered duos
        if (registeredDuoIds.length > 0) {
          query = query.not('id', 'in', `(${registeredDuoIds.join(',')})`);
        }

        const { data: partnerships, error } = await query;

        if (error) throw error;

        setDuos(partnerships || []);
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

      const isEligible = await verifyRegistrationEligibility();
      if (!isEligible) {
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
      <RegistrationButton 
        onClick={() => setIsDialogOpen(true)} 
        disabled={!canRegister || isLoading}
      />
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
