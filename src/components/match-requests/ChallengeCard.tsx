import { Card } from "@/components/ui/card";
import { ResultSubmissionDialog } from "./ResultSubmissionDialog";
import { ResultApprovalCard } from "./ResultApprovalCard";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeDetails } from "./ChallengeDetails";
import { ChallengeStatus } from "./ChallengeStatus";
import { Challenge, ChallengeType } from "@/types/match";

interface ChallengeCardProps {
  challenge: Challenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeCard = ({ challenge, type, onResponse }: ChallengeCardProps) => {
  const currentUserId = type === 'sent' ? challenge.challenger_id : challenge.challenged_id;

  const isMatchTime = () => {
    const now = new Date();
    const matchTime = new Date(challenge.proposed_time);
    return now >= matchTime;
  };

  const renderResultSubmission = () => {
    if (challenge.status !== 'accepted' || !isMatchTime()) return null;
    if (!challenge.winner_id) {
      return <ResultSubmissionDialog challenge={challenge} />;
    }
    return null;
  };

  const renderScores = () => {
    if (challenge.status !== 'completed' || !challenge.winner_score) return null;
    const isWinner = challenge.winner_id === currentUserId;
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900">Match Result:</p>
        <div className="flex gap-2 items-center mt-1">
          <span className={`text-sm ${isWinner ? 'text-green-600' : 'text-red-600'}`}>
            {isWinner ? challenge.winner_score : challenge.loser_score}
          </span>
          <span className="text-gray-500">vs</span>
          <span className={`text-sm ${!isWinner ? 'text-green-600' : 'text-red-600'}`}>
            {!isWinner ? challenge.winner_score : challenge.loser_score}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-4">
          <ChallengeHeader challenge={challenge} type={type} />
          <ChallengeDetails challenge={challenge} />
        </div>
        <ChallengeStatus 
          challenge={challenge} 
          type={type} 
          onResponse={onResponse} 
        />
      </div>
      {renderScores()}
      {renderResultSubmission()}
      <ResultApprovalCard challenge={challenge} currentUserId={currentUserId} />
    </Card>
  );
};