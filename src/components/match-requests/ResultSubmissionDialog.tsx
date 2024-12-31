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
  const [winnerScore, setWinnerScore] = useState("");
  const [loserScore, setLoserScore] = useState("");
  const [winnerId, setWinnerId] = useState<string>("");

  const handleResultSubmit = async () => {
    if (!winnerScore || !loserScore || !winnerId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
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

  return (
    <Dialog>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Winner Score</Label>
              <Input
                placeholder="6"
                value={winnerScore}
                onChange={(e) => setWinnerScore(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Loser Score</Label>
              <Input
                placeholder="4"
                value={loserScore}
                onChange={(e) => setLoserScore(e.target.value)}
              />
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