import { Challenge } from "@/types/match";
import { ResultSubmissionDialog } from "./ResultSubmissionDialog";
import { ResultApprovalCard } from "./ResultApprovalCard";

interface MatchActionsProps {
  challenge: Challenge;
  currentUserId: string;
  isMatchTime: boolean;
}

export const MatchActions = ({ challenge, currentUserId, isMatchTime }: MatchActionsProps) => {
  const renderResultSubmission = () => {
    if (challenge.status !== 'accepted' || !isMatchTime) return null;
    if (!challenge.winner_id) {
      return <ResultSubmissionDialog challenge={challenge} />;
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