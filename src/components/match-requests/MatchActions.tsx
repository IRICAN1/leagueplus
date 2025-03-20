
import { Challenge } from "@/types/match";
import { ResultSubmissionDialog } from "./ResultSubmissionDialog";
import { ResultApprovalCard } from "./ResultApprovalCard";
import { MatchScoreDisplay } from "./MatchScoreDisplay";

interface MatchActionsProps {
  challenge: Challenge;
  currentUserId: string;
  isMatchTime: boolean;
}

export const MatchActions = ({ challenge, currentUserId, isMatchTime }: MatchActionsProps) => {
  const renderResultSubmission = () => {
    if (challenge.status !== 'accepted' || !isMatchTime) return null;
    
    // Only show submission form if there's no winner yet
    if (!challenge.winner_id) {
      return <ResultSubmissionDialog challenge={challenge} currentUserId={currentUserId} />;
    }

    // If a user has submitted a result and it's pending
    if (challenge.status === 'completed' && challenge.result_status === 'pending') {
      // If this user submitted the result, show waiting message
      if (challenge.winner_id) {
        const isSubmitter = challenge.winner_id === currentUserId;
        const winnerUsername = challenge.winner_id === challenge.challenger_id 
          ? challenge.challenger.username 
          : challenge.challenged.username;

        if (isSubmitter) {
          return (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Result Submitted - Waiting for Approval</p>
              <MatchScoreDisplay
                winnerScore={challenge.winner_score}
                loserScore={challenge.loser_score}
                winnerUsername={winnerUsername}
              />
            </div>
          );
        }
      }
    }
    
    return null;
  };

  return (
    <>
      {renderResultSubmission()}
      <ResultApprovalCard challenge={challenge} currentUserId={currentUserId} />
    </>
  );
};
