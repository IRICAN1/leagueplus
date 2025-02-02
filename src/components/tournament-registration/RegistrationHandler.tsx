import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DuoSelectionDialog } from "./DuoSelectionDialog";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface RegistrationHandlerProps {
  leagueId: string;
  isDoubles: boolean;
  requirements?: {
    skillLevel?: string;
    ageCategory?: string;
    genderCategory?: string;
  };
}

export const RegistrationHandler = ({ 
  leagueId, 
  isDoubles,
  requirements 
}: RegistrationHandlerProps) => {
  const navigate = useNavigate();
  const [duos, setDuos] = useState<any[]>([]);
  const [showDuoSelection, setShowDuoSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingRegistration, setExistingRegistration] = useState(false);

  useEffect(() => {
    if (isDoubles) {
      checkExistingRegistration();
      fetchDuos();
    }
  }, [isDoubles, leagueId]);

  const checkExistingRegistration = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check existing registrations through duo partnerships
      const { data: registrations, error } = await supabase
        .from('league_participants')
        .select(`
          *,
          duo_partnership:duo_partnerships(
            player1_id,
            player2_id
          )
        `)
        .eq('league_id', leagueId);

      if (error) throw error;

      // Check if user is part of any registered duo
      const isRegistered = registrations?.some(reg => {
        const duo = reg.duo_partnership;
        return duo && (duo.player1_id === user.id || duo.player2_id === user.id);
      });

      setExistingRegistration(!!isRegistered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const fetchDuos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get existing registrations for this league
      const { data: existingRegistrations } = await supabase
        .from('league_participants')
        .select('duo_partnership_id')
        .eq('league_id', leagueId);

      const registeredDuoIds = existingRegistrations?.map(reg => reg.duo_partnership_id) || [];

      // Fetch active duo partnerships that aren't already registered
      const { data: partnerships, error } = await supabase
        .from('duo_partnerships')
        .select(`
          *,
          player2:profiles!duo_partnerships_player2_id_fkey(*),
          duo_statistics(*)
        `)
        .eq('player1_id', user.id)
        .eq('active', true)
        .not('id', 'in', registeredDuoIds);

      if (error) throw error;

      if (partnerships) {
        setDuos(partnerships);
      }
    } catch (error: any) {
      toast.error("Failed to fetch duo partnerships");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuoSelect = async (duoId: string) => {
    try {
      const { error: registrationError } = await supabase
        .from('league_participants')
        .insert({
          league_id: leagueId,
          duo_partnership_id: duoId
        });

      if (registrationError) throw registrationError;

      // Send notifications to both players
      const selectedDuo = duos.find(d => d.id === duoId);
      if (selectedDuo) {
        await Promise.all([
          supabase.from('notifications').insert({
            user_id: selectedDuo.player1_id,
            type: 'league_registration',
            title: 'New League Registration',
            message: `Your duo has been registered for a new league`
          }),
          supabase.from('notifications').insert({
            user_id: selectedDuo.player2_id,
            type: 'league_registration',
            title: 'New League Registration',
            message: `Your duo has been registered for a new league`
          })
        ]);
      }

      toast.success("Successfully registered for the league!");
      navigate(`/tournament/${leagueId}`);
    } catch (error: any) {
      toast.error("Failed to register for the league");
      console.error("Error:", error);
    }
  };

  if (existingRegistration) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Already Registered</AlertTitle>
        <AlertDescription>
          You are already registered in this league through a duo partnership.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoading && duos.length === 0) {
    return (
      <Alert>
        <AlertTitle>Duo Partnership Required</AlertTitle>
        <AlertDescription className="space-y-4">
          <p>You need an active duo partnership to join this league.</p>
          <Button 
            onClick={() => navigate('/duo-search')}
            className="w-full md:w-auto"
          >
            <Users className="mr-2 h-4 w-4" />
            Find Duo Partner
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <DuoSelectionDialog
        isOpen={showDuoSelection}
        onClose={() => setShowDuoSelection(false)}
        duos={duos}
        onSelect={handleDuoSelect}
        leagueRequirements={requirements}
      />
    </>
  );
};