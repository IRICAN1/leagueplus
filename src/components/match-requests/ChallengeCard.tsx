import { Card } from "@/components/ui/card";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeDetails } from "./ChallengeDetails";
import { ChallengeStatus } from "./ChallengeStatus";
import { Challenge, ChallengeType } from "@/types/match";
import { MessageButton } from "./MessageButton";
import { MatchScoresTable } from "./MatchScoresTable";
import { MatchActions } from "./MatchActions";

interface ChallengeCardProps {
  challenge: Challenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeCard = ({ challenge, type, onResponse }: ChallengeCardProps) => {
  const currentUserId = type === 'sent' ? challenge.challenger_id : challenge.challenged_id;
  const otherUserId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;

  const isMatchTime = () => {
    const now = new Date();
    const matchTime = new Date(challenge.proposed_time);
    return now >= matchTime;
  };

  const parseScore = (score: string | null) => {
    if (!score) return [];
    return score.split('-').map(set => set.trim());
  };

  const renderScores = () => {
    if (challenge.status !== 'completed' || !challenge.winner_score) return null;
    const isWinner = challenge.winner_id === currentUserId;
    const winnerName = isWinner ? challenge.challenger.username : challenge.challenged.username;
    const loserName = !isWinner ? challenge.challenger.username : challenge.challenged.username;
    const winnerSets = parseScore(challenge.winner_score);
    const loserSets = parseScore(challenge.loser_score);

    // Add third set scores if they exist
    if (challenge.winner_score_set3) {
      winnerSets.push(challenge.winner_score_set3);
      loserSets.push(challenge.loser_score_set3);
    }

    return (
      <MatchScoresTable
        winnerName={winnerName}
        loserName={loserName}
        winnerSets={winnerSets}
        loserSets={loserSets}
      />
    );
  };

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-4">
          <ChallengeHeader challenge={challenge} type={type} />
          <ChallengeDetails challenge={challenge} />
        </div>
        <div className="flex flex-col gap-2">
          <ChallengeStatus 
            challenge={challenge} 
            type={type} 
            onResponse={onResponse} 
          />
          <MessageButton
            currentUserId={currentUserId}
            otherUserId={otherUserId}
            challengeId={challenge.id}
          />
        </div>
      </div>
      {renderScores()}
      <MatchActions
        challenge={challenge}
        currentUserId={currentUserId}
        isMatchTime={isMatchTime()}
      />
    </Card>
  );
};