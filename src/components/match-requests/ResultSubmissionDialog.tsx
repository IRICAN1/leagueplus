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
import { supabase } from "@/integrations/supabase/client";
import { WinnerSelection } from "./WinnerSelection";
import { SetScoreInput } from "./SetScoreInput";
import { ThirdSetInput } from "./ThirdSetInput";
import { validateMatchResult } from "./utils/scoreValidation";

interface ResultSubmissionDialogProps {
  challenge: any;
}

export const ResultSubmissionDialog = ({ challenge }: ResultSubmissionDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winnerScore1, setWinnerScore1] = useState("");
  const [loserScore1, setLoserScore1] = useState("");
  const [winnerScore2, setWinnerScore2] = useState("");
  const [loserScore2, setLoserScore2] = useState("");
  const [winnerScore3, setWinnerScore3] = useState("");
  const [loserScore3, setLoserScore3] = useState("");
  const [winnerId, setWinnerId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTiebreak1, setIsTiebreak1] = useState(false);
  const [isTiebreak2, setIsTiebreak2] = useState(false);
  const [isTiebreak3, setIsTiebreak3] = useState(false);
  const [showThirdSet, setShowThirdSet] = useState(false);

  const resetForm = () => {
    setWinnerScore1("");
    setWinnerScore2("");
    setWinnerScore3("");
    setLoserScore1("");
    setLoserScore2("");
    setLoserScore3("");
    setWinnerId("");
    setIsTiebreak1(false);
    setIsTiebreak2(false);
    setIsTiebreak3(false);
    setShowThirdSet(false);
  };

  const validateForm = () => {
    if (!winnerId) {
      toast({
        title: "Error",
        description: "Please select a winner",
        variant: "destructive",
      });
      return false;
    }

    if (!winnerScore1 || !loserScore1 || !winnerScore2 || !loserScore2) {
      toast({
        title: "Error",
        description: "Please fill in all scores for the first two sets",
        variant: "destructive",
      });
      return false;
    }

    if (showThirdSet && (!winnerScore3 || !loserScore3)) {
      toast({
        title: "Error",
        description: "Please fill in all scores for the third set",
        variant: "destructive",
      });
      return false;
    }

    const isValid = validateMatchResult(
      winnerScore1,
      loserScore1,
      winnerScore2,
      loserScore2,
      showThirdSet ? winnerScore3 : null,
      showThirdSet ? loserScore3 : null,
      isTiebreak1,
      isTiebreak2,
      isTiebreak3
    );

    if (!isValid) {
      toast({
        title: "Invalid Score",
        description: "Please enter valid tennis scores",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleResultSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const winnerScore = `${winnerScore1}-${winnerScore2}`;
      const loserScore = `${loserScore1}-${loserScore2}`;

      const updateData: any = {
        winner_id: winnerId,
        winner_score: winnerScore,
        loser_score: loserScore,
        status: 'completed',
        result_status: 'pending'
      };

      if (showThirdSet) {
        updateData.winner_score_set3 = winnerScore3;
        updateData.loser_score_set3 = loserScore3;
      }

      const { error } = await supabase
        .from('match_challenges')
        .update(updateData)
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: "Result submitted",
        description: "Waiting for opponent's approval",
      });
      
      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error submitting result:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
          Submit Match Result
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Match Result</DialogTitle>
          <DialogDescription>
            Enter the match scores. For tiebreak sets, toggle the switch and enter the final score.
            {!showThirdSet && " Add a third set if the match went to a final set."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <WinnerSelection
            challenge={challenge}
            winnerId={winnerId}
            setWinnerId={setWinnerId}
          />

          <SetScoreInput
            setNumber={1}
            winnerScore={winnerScore1}
            loserScore={loserScore1}
            isTiebreak={isTiebreak1}
            onWinnerScoreChange={setWinnerScore1}
            onLoserScoreChange={setLoserScore1}
            onTiebreakChange={setIsTiebreak1}
          />

          <SetScoreInput
            setNumber={2}
            winnerScore={winnerScore2}
            loserScore={loserScore2}
            isTiebreak={isTiebreak2}
            onWinnerScoreChange={setWinnerScore2}
            onLoserScoreChange={setLoserScore2}
            onTiebreakChange={setIsTiebreak2}
          />

          <ThirdSetInput
            showThirdSet={showThirdSet}
            winnerScore={winnerScore3}
            loserScore={loserScore3}
            isTiebreak={isTiebreak3}
            onWinnerScoreChange={setWinnerScore3}
            onLoserScoreChange={setLoserScore3}
            onTiebreakChange={setIsTiebreak3}
            onToggleThirdSet={() => setShowThirdSet(true)}
          />

          <Button
            onClick={handleResultSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Result"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};