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
      <div className="mt-4">
        <Table className="w-auto min-w-[200px] mx-auto bg-gradient-to-r from-gray-50 to-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-[140px] font-semibold text-gray-700">Player</TableHead>
              {winnerSets.map((_, index) => (
                <TableHead key={index} className="text-center w-16 font-semibold text-gray-700">
                  Set {index + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-blue-50/50 transition-colors">
              <TableCell className="font-medium text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {winnerName}
                </div>
              </TableCell>
              {winnerSets.map((score, index) => (
                <TableCell 
                  key={index} 
                  className="text-center font-bold text-green-600 bg-green-50/50"
                >
                  {score}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="hover:bg-blue-50/50 transition-colors">
              <TableCell className="font-medium text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  {loserName}
                </div>
              </TableCell>
              {loserSets.map((score, index) => (
                <TableCell 
                  key={index} 
                  className="text-center font-bold text-red-600 bg-red-50/50"
                >
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