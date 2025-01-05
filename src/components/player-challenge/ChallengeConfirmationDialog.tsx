import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChallengeConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  challengeDetails: {
    playerName: string;
    leagueName: string;
    location: string;
    proposedTime: string;
    leagueId: string;
  };
}

export const ChallengeConfirmationDialog = ({
  isOpen,
  onClose,
  challengeDetails,
}: ChallengeConfirmationDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to create a challenge");
      }

      console.log("Creating challenge with:", {
        challenger_id: session.user.id,
        league_id: challengeDetails.leagueId,
        location: challengeDetails.location,
        proposed_time: challengeDetails.proposedTime
      });

      const { error } = await supabase
        .from('match_challenges')
        .insert({
          challenger_id: session.user.id,
          league_id: challengeDetails.leagueId,
          location: challengeDetails.location,
          proposed_time: challengeDetails.proposedTime,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Challenge Created",
        description: "Your challenge has been sent successfully.",
      });
      onClose();
    } catch (error: any) {
      console.error("Challenge creation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Challenge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to challenge {challengeDetails.playerName} in {challengeDetails.leagueName}?</p>
          <p>Location: {challengeDetails.location}</p>
          <p>Proposed Time: {new Date(challengeDetails.proposedTime).toLocaleString()}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm Challenge</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};