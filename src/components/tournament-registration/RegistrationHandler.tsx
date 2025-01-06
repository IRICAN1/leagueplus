import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DuoSelectionDialog } from "./DuoSelectionDialog";
import { toast } from "sonner";

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

  useEffect(() => {
    if (isDoubles) {
      fetchDuos();
    }
  }, [isDoubles]);

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
        .eq('player1_id', user.id)
        .eq('active', true);

      if (error) throw error;

      if (partnerships && partnerships.length > 0) {
        setDuos(partnerships);
        if (partnerships.length > 1) {
          setShowDuoSelection(true);
        } else {
          // Auto-select if only one duo exists
          handleDuoSelect(partnerships[0].id);
        }
      } else {
        // No duos found, redirect to duo creation
        toast.error("You need a duo partner to join this league");
        navigate("/duo-search");
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
      const { error } = await supabase
        .from('league_participants')
        .insert({
          league_id: leagueId,
          duo_partnership_id: duoId
        });

      if (error) throw error;

      toast.success("Successfully registered for the league!");
      navigate(`/tournament/${leagueId}`);
    } catch (error: any) {
      toast.error("Failed to register for the league");
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
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