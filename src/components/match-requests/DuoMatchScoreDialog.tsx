
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ScoreSubmissionForm } from "./ScoreSubmissionForm";
import { DuoChallenge } from "@/types/match";
import { supabase } from "@/integrations/supabase/client";

interface DuoMatchScoreDialogProps {
  challenge: DuoChallenge;
  currentUserId: string;
}

export const DuoMatchScoreDialog = ({ challenge, currentUserId }: DuoMatchScoreDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if the current user belongs to either partnership
  const isParticipant = 
    (challenge.challenger_partnership.player1.id === currentUserId ||
     challenge.challenger_partnership.player2.id === currentUserId ||
     challenge.challenged_partnership.player1.id === currentUserId ||
     challenge.challenged_partnership.player2.id === currentUserId);

  // Check if the match already has a submitted result waiting for approval
  const hasSubmittedResult = challenge.status === 'completed' && 
                            challenge.result_status === 'pending' && 
                            challenge.winner_partnership_id !== null;

  const handleScoreSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const winnerPartnershipId = formData.winnerId;
      const winnerScore = `${formData.winnerScore1}-${formData.winnerScore2}`;
      const loserScore = `${formData.loserScore1}-${formData.loserScore2}`;

      const updateData: any = {
        winner_partnership_id: winnerPartnershipId,
        winner_score: winnerScore,
        loser_score: loserScore,
        status: 'completed',
        result_status: 'pending',
        submitter_id: currentUserId
      };

      // Add third set scores if provided
      if (formData.showThirdSet && formData.winnerScore3 && formData.loserScore3) {
        updateData.winner_score_set3 = formData.winnerScore3;
        updateData.loser_score_set3 = formData.loserScore3;
      }

      console.log('Submitting score data:', updateData);

      const { error } = await supabase
        .from('duo_match_challenges')
        .update(updateData)
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: "Score submitted",
        description: "Waiting for opponent's approval",
      });
      
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error submitting score:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isParticipant || challenge.status !== 'accepted') {
    return null;
  }

  const matchTime = new Date(challenge.proposed_time);
  const now = new Date();
  if (matchTime > now) {
    return null;
  }

  if (hasSubmittedResult) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
          Submit Match Result
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Duo Match Result</DialogTitle>
          <DialogDescription>
            Enter the match scores. For tiebreak sets, toggle the switch and enter the final score.
          </DialogDescription>
        </DialogHeader>
        <ScoreSubmissionForm
          challenge={challenge}
          onSubmit={handleScoreSubmit}
          isSubmitting={isSubmitting}
          isDuo={true}
        />
      </DialogContent>
    </Dialog>
  );
};
