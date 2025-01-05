import { MatchScoreDisplay } from "./MatchScoreDisplay";
import { ApprovalActions } from "./ApprovalActions";

interface PendingApprovalCardProps {
  winnerScore: string;
  loserScore: string;
  winnerUsername: string;
  onApprove: () => void;
  onDispute: () => void;
}

export const PendingApprovalCard = ({
  winnerScore,
  loserScore,
  winnerUsername,
  onApprove,
  onDispute,
}: PendingApprovalCardProps) => {
  return (
    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
      <p className="text-sm font-medium mb-2">Match Result Pending Approval</p>
      <MatchScoreDisplay
        winnerScore={winnerScore}
        loserScore={loserScore}
        winnerUsername={winnerUsername}
      />
      <ApprovalActions onApprove={onApprove} onDispute={onDispute} />
    </div>
  );
};