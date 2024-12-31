import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ResultApprovalCardProps {
  challenge: any;
  currentUserId: string;
}

export const ResultApprovalCard = ({ challenge, currentUserId }: ResultApprovalCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleResultApproval = async (approved: boolean) => {
    try {
      const { error } = await supabase
        .from('match_challenges')
        .update({
          result_status: approved ? 'approved' : 'disputed'
        })
        .eq('id', challenge.id);

      if (error) throw error;

      // Invalidate and refetch relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['match-challenges'] }),
        queryClient.invalidateQueries({ queryKey: ['player-statistics'] }),
        queryClient.invalidateQueries({ queryKey: ['league-rankings'] })
      ]);

      toast({
        title: approved ? "Result approved" : "Result disputed",
        description: approved 
          ? "The match result has been confirmed and rankings have been updated"
          : "The match result has been marked as disputed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatScore = (score: string) => {
    return score.replace('-', ' - ');
  };

  if (challenge.result_status === 'pending' && challenge.winner_id) {
    // Show approval UI for the opponent
    if (currentUserId !== challenge.winner_id) {
      return (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium mb-2">Match Result Pending Approval</p>
          <p className="text-sm mb-3">
            Score: {formatScore(challenge.winner_score)} | {formatScore(challenge.loser_score)}
            <br />
            Winner: {challenge.winner_id === challenge.challenger_id 
              ? challenge.challenger.username 
              : challenge.challenged.username}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleResultApproval(false)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Dispute
            </Button>
            <Button
              size="sm"
              onClick={() => handleResultApproval(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm">Waiting for opponent to approve the result</p>
        <p className="text-sm mt-2">
          Submitted Score: {formatScore(challenge.winner_score)} | {formatScore(challenge.loser_score)}
        </p>
      </div>
    );
  }

  return null;
};