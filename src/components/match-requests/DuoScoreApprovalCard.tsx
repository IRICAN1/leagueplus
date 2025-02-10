
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DuoChallenge } from "@/types/match";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

interface DuoScoreApprovalCardProps {
  challenge: DuoChallenge;
  currentUserId: string | null;
  onScoreApproved: () => void;
}

export const DuoScoreApprovalCard = ({ 
  challenge, 
  currentUserId,
  onScoreApproved 
}: DuoScoreApprovalCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleScoreResponse = async (approved: boolean) => {
    try {
      console.log('Updating duo match challenge:', challenge.id, 'with approval:', approved);
      
      const { error } = await supabase
        .from('duo_match_challenges')
        .update({
          result_status: approved ? 'approved' : 'disputed',
          approver_id: currentUserId,
          updated_at: new Date().toISOString()
        })
        .eq('id', challenge.id);

      if (error) throw error;

      // Invalidate relevant queries to refresh the data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['duo-match-challenges'] }),
        queryClient.invalidateQueries({ queryKey: ['duo-rankings'] }),
        queryClient.invalidateQueries({ queryKey: ['duo-statistics'] })
      ]);

      toast({
        title: approved ? "Score approved" : "Score disputed",
        description: approved 
          ? "The match result has been confirmed and rankings have been updated" 
          : "The match result has been marked as disputed",
      });

      if (approved) {
        onScoreApproved();
      }
    } catch (error: any) {
      console.error('Error in handleScoreResponse:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Only show approval UI for completed matches pending approval
  if (challenge.status !== 'completed' || challenge.result_status !== 'pending') {
    return null;
  }

  // Don't show approval UI to the user who submitted the score
  if (challenge.submitter_id === currentUserId) {
    return (
      <Card className="mt-4 p-4 bg-yellow-50">
        <p className="text-sm text-yellow-700">
          Waiting for opponent to approve the match result
        </p>
      </Card>
    );
  }

  // Check if the current user is from the opposite partnership
  const isFromOppositePartnership = 
    challenge.submitter_id && 
    ((challenge.challenger_partnership.player1.id === challenge.submitter_id || 
      challenge.challenger_partnership.player2.id === challenge.submitter_id) ?
      (challenge.challenged_partnership.player1.id === currentUserId || 
       challenge.challenged_partnership.player2.id === currentUserId) :
      (challenge.challenger_partnership.player1.id === currentUserId || 
       challenge.challenger_partnership.player2.id === currentUserId));

  if (!isFromOppositePartnership) {
    return null;
  }

  return (
    <Card className="mt-4 p-4 bg-yellow-50">
      <p className="text-sm font-medium mb-3">Please verify the match result:</p>
      <div className="space-y-2">
        <p className="text-sm">
          Winner: {challenge.winner_partnership_id === challenge.challenger_partnership.id 
            ? `${challenge.challenger_partnership.player1.full_name} & ${challenge.challenger_partnership.player2.full_name}`
            : `${challenge.challenged_partnership.player1.full_name} & ${challenge.challenged_partnership.player2.full_name}`}
        </p>
        <p className="text-sm">Score: {challenge.winner_score} - {challenge.loser_score}</p>
        {challenge.winner_score_set3 && (
          <p className="text-sm">Third Set: {challenge.winner_score_set3} - {challenge.loser_score_set3}</p>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={() => handleScoreResponse(false)}
          className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Dispute
        </Button>
        <Button 
          onClick={() => handleScoreResponse(true)}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Approve
        </Button>
      </div>
    </Card>
  );
};
