import { Card } from "@/components/ui/card";
import { ResultSubmissionDialog } from "./ResultSubmissionDialog";
import { ResultApprovalCard } from "./ResultApprovalCard";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeDetails } from "./ChallengeDetails";
import { ChallengeStatus } from "./ChallengeStatus";
import { Challenge, ChallengeType } from "@/types/match";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">Match Result:</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Player</TableHead>
              <TableHead className="text-center">Set 1</TableHead>
              <TableHead className="text-center">Set 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{winnerName}</TableCell>
              {winnerSets.map((score, index) => (
                <TableCell key={index} className="text-center font-semibold text-green-600">
                  {score}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{loserName}</TableCell>
              {loserSets.map((score, index) => (
                <TableCell key={index} className="text-center font-semibold text-red-600">
                  {score}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
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