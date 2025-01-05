import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PendingApprovalCard } from "./PendingApprovalCard";
import { MatchScoreDisplay } from "./MatchScoreDisplay";

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
          result_status: approved ? 'approved' : 'disputed',
          updated_at: new Date().toISOString()
        })
        .eq('id', challenge.id)
        .select()
        .single();

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['match-challenges'] }),
        queryClient.invalidateQueries({ queryKey: ['player-statistics'] }),
        queryClient.invalidateQueries({ queryKey: ['league-rankings'] }),
        queryClient.invalidateQueries({ queryKey: ['match-history'] }),
        queryClient.invalidateQueries({ 
          queryKey: ['player-statistics', challenge.league_id],
          exact: true 
        }),
        queryClient.invalidateQueries({ 
          queryKey: ['player-rankings', challenge.league_id],
          exact: true 
        })
      ]);

      toast({
        title: approved ? "Result approved" : "Result disputed",
        description: approved 
          ? "The match result has been confirmed and rankings have been updated"
          : "The match result has been marked as disputed",
      });
    } catch (error: any) {
      console.error('Error in handleResultApproval:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (challenge.result_status === 'pending' && challenge.winner_id) {
    // Show approval UI for the opponent
    if (currentUserId !== challenge.winner_id) {
      const winnerUsername = challenge.winner_id === challenge.challenger_id 
        ? challenge.challenger.username 
        : challenge.challenged.username;

      return (
        <PendingApprovalCard
          winnerScore={challenge.winner_score}
          loserScore={challenge.loser_score}
          winnerUsername={winnerUsername}
          onApprove={() => handleResultApproval(true)}
          onDispute={() => handleResultApproval(false)}
        />
      );
    }
    return (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm">Waiting for opponent to approve the result</p>
        <MatchScoreDisplay
          winnerScore={challenge.winner_score}
          loserScore={challenge.loser_score}
          winnerUsername={challenge.winner_id === challenge.challenger_id 
            ? challenge.challenger.username 
            : challenge.challenged.username}
        />
      </div>
    );
  }

  return null;
};