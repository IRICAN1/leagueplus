
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MatchScoreDisplay } from "./MatchScoreDisplay";
import { DuoChallenge } from "@/types/match";
import { useQueryClient } from "@tanstack/react-query";

interface DuoScoreApprovalCardProps {
  challenge: DuoChallenge;
  currentUserId: string | null;
  onScoreApproved?: () => void;
}

export const DuoScoreApprovalCard = ({ challenge, currentUserId, onScoreApproved }: DuoScoreApprovalCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if the current user is from the opposing partnership
  const isFromOpposingPartnership = () => {
    // If the current user is the submitter, they can't approve
    if (challenge.submitter_id === currentUserId) {
      return false;
    }

    // Determine which partnership the submitter belongs to
    const submitterPartnership = 
      (challenge.challenger_partnership.player1.id === challenge.submitter_id || 
       challenge.challenger_partnership.player2.id === challenge.submitter_id) 
        ? challenge.challenger_partnership 
        : challenge.challenged_partnership;
    
    // Check if current user is in the other partnership
    const opposingPartnership = 
      submitterPartnership.id === challenge.challenger_partnership.id 
        ? challenge.challenged_partnership 
        : challenge.challenger_partnership;
    
    return (
      opposingPartnership.player1.id === currentUserId || 
      opposingPartnership.player2.id === currentUserId
    );
  };

  const handleScoreResponse = async (approved: boolean) => {
    try {
      console.log('Updating duo match challenge:', challenge.id, 'with approval:', approved);
      
      // Update the match challenge with the appropriate approval status
      const { error } = await supabase
        .from('duo_match_challenges')
        .update({
          result_status: approved ? 'approved' : 'disputed',
          approver_id: currentUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', challenge.id); // Add the WHERE clause to specify which match to update

      if (error) {
        console.error('Error in handleScoreResponse:', error);
        throw error;
      }

      // Invalidate relevant queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['duo-rankings'] }),
        queryClient.invalidateQueries({ queryKey: ['match-history'] }),
        queryClient.invalidateQueries({ queryKey: ['duo-match-challenges'] })
      ]);

      toast({
        title: approved ? "Score Approved" : "Score Disputed",
        description: approved 
          ? "The match result has been confirmed and rankings will be updated."
          : "The match result has been marked as disputed.",
      });

      if (approved && onScoreApproved) {
        onScoreApproved();
      }
      
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error in handleScoreResponse:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Skip rendering if the current user submitted the score
  if (challenge.submitter_id === currentUserId) {
    return null;
  }

  // Skip rendering if the current user is not from the opposing partnership
  if (!isFromOpposingPartnership()) {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Only players from the opposing partnership can approve the result</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm font-medium mb-2">Score Needs Approval</p>
        <MatchScoreDisplay
          winnerScore={challenge.winner_score}
          loserScore={challenge.loser_score}
          winnerUsername={
            challenge.winner_partnership_id === challenge.challenger_partnership.id
              ? `${challenge.challenger_partnership.player1.username} & ${challenge.challenger_partnership.player2.username}`
              : `${challenge.challenged_partnership.player1.username} & ${challenge.challenged_partnership.player2.username}`
          }
        />
        <div className="flex gap-2 mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsOpen(true)}
          >
            Dispute
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleScoreResponse(true)}
          >
            Approve
          </Button>
        </div>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dispute Match Result</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to dispute this match result? This will notify administrators and your opponent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleScoreResponse(false)}
              className="bg-red-600 hover:bg-red-700"
            >
              Dispute Result
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
