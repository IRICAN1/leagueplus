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
import { submitMatchResult } from "./utils/matchSubmission";
import { Challenge } from "@/types/match";

interface ResultSubmissionDialogProps {
  challenge: Challenge;
}

export const ResultSubmissionDialog = ({ challenge }: ResultSubmissionDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleResultSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      await submitMatchResult(challenge, formData);
      
      toast({
        title: "Result submitted",
        description: "Waiting for opponent's approval",
      });
      
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
          </DialogDescription>
        </DialogHeader>
        <ScoreSubmissionForm
          challenge={challenge}
          onSubmit={handleResultSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};