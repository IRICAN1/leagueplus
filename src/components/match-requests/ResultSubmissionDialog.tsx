import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [winnerId, setWinnerId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleResultSubmit = async () => {
    if (!winnerScore1 || !loserScore1 || !winnerScore2 || !loserScore2 || !winnerId) {
      toast({
        title: "Error",
        description: "Please fill in all scores and select a winner",
        variant: "destructive",
      });
      return;
    }

    // Validate tennis scores
    if (!isValidTennisScore(winnerScore1, loserScore1) || !isValidTennisScore(winnerScore2, loserScore2)) {
      toast({
        title: "Invalid Score",
        description: "Please enter valid tennis scores (0-7)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const winnerScore = `${winnerScore1}-${winnerScore2}`;
      const loserScore = `${loserScore1}-${loserScore2}`;

      const { error } = await supabase
        .from('match_challenges')
        .update({
          winner_id: winnerId,
          winner_score: winnerScore,
          loser_score: loserScore,
          status: 'completed',
          result_status: 'pending'
        })
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: "Result submitted",
        description: "Waiting for opponent's approval",
      });
      
      // Reset form but don't close dialog
      setWinnerScore1("");
      setWinnerScore2("");
      setLoserScore1("");
      setLoserScore2("");
      setWinnerId("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidTennisScore = (score1: string, score2: string) => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);
    
    if (isNaN(s1) || isNaN(s2)) return false;
    if (s1 < 0 || s1 > 7 || s2 < 0 || s2 > 7) return false;
    if (s1 === 7 && s2 > 5) return false;
    if (s2 === 7 && s1 > 5) return false;
    if (s1 < 6 && s2 < 6 && Math.abs(s1 - s2) >= 2) return false;
    
    return true;
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
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup
            value={winnerId}
            onValueChange={setWinnerId}
            className="flex flex-col space-y-2"
          >
            <Label>Winner</Label>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={challenge.challenger_id} id="challenger" />
              <Label htmlFor="challenger">{challenge.challenger.username}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={challenge.challenged_id} id="challenged" />
              <Label htmlFor="challenged">{challenge.challenged.username}</Label>
            </div>
          </RadioGroup>

          <div className="space-y-4">
            <Label>First Set</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Winner Score</Label>
                <Input
                  placeholder="6"
                  value={winnerScore1}
                  onChange={(e) => setWinnerScore1(e.target.value)}
                  maxLength={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Loser Score</Label>
                <Input
                  placeholder="4"
                  value={loserScore1}
                  onChange={(e) => setLoserScore1(e.target.value)}
                  maxLength={1}
                />
              </div>
            </div>

            <Label>Second Set</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Winner Score</Label>
                <Input
                  placeholder="6"
                  value={winnerScore2}
                  onChange={(e) => setWinnerScore2(e.target.value)}
                  maxLength={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Loser Score</Label>
                <Input
                  placeholder="3"
                  value={loserScore2}
                  onChange={(e) => setLoserScore2(e.target.value)}
                  maxLength={1}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleResultSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Submit Result
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};