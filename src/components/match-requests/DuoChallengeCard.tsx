
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, CircleDot, Check, Users } from "lucide-react";
import { DuoChallenge, ChallengeType } from "@/types/match";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MatchScoresTable } from "./MatchScoresTable";
import { ChallengeStatus } from "./ChallengeStatus";

interface DuoChallengeCardProps {
  challenge: DuoChallenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const DuoChallengeCard = ({ challenge, type, onResponse }: DuoChallengeCardProps) => {
  const currentPartnership = type === 'sent' ? challenge.challenger_partnership : challenge.challenged_partnership;
  const otherPartnership = type === 'sent' ? challenge.challenged_partnership : challenge.challenger_partnership;

  const parseScore = (score: string | null) => {
    if (!score) return [];
    return score.split('-').map(set => set.trim());
  };

  const renderScores = () => {
    if (challenge.status !== 'completed' || !challenge.winner_score) return null;
    
    const isWinner = challenge.winner_partnership_id === currentPartnership.id;
    const winnerTeam = `${isWinner ? currentPartnership : otherPartnership}.player1.full_name & ${isWinner ? currentPartnership : otherPartnership}.player2.full_name`;
    const loserTeam = `${!isWinner ? currentPartnership : otherPartnership}.player1.full_name & ${!isWinner ? currentPartnership : otherPartnership}.player2.full_name`;
    
    const winnerSets = parseScore(challenge.winner_score);
    const loserSets = parseScore(challenge.loser_score);

    if (challenge.winner_score_set3) {
      winnerSets.push(challenge.winner_score_set3);
      loserSets.push(challenge.loser_score_set3);
    }

    return (
      <MatchScoresTable
        winnerName={winnerTeam}
        loserName={loserTeam}
        winnerSets={winnerSets}
        loserSets={loserSets}
      />
    );
  };

  const renderPartnership = (partnership: DuoChallenge['challenger_partnership'], isWinner?: boolean) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border-2 border-blue-100">
          <AvatarImage src={partnership.player1.avatar_url || undefined} />
          <AvatarFallback>{partnership.player1.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <Avatar className="h-8 w-8 border-2 border-purple-100">
          <AvatarImage src={partnership.player2.avatar_url || undefined} />
          <AvatarFallback>{partnership.player2.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {partnership.player1.full_name} & {partnership.player2.full_name}
          </span>
          {isWinner && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Trophy className="h-3 w-3" />
              <span className="text-xs">Winners</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in border-l-4 border-l-blue-400 hover:scale-[1.01] bg-white/80">
      <CardContent className="p-2 sm:p-3 bg-gradient-to-r from-gray-50/90 via-blue-50/50 to-gray-50/90">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              {renderPartnership(currentPartnership, challenge.winner_partnership_id === currentPartnership.id)}
            </div>

            <div className="text-sm font-medium text-gray-500">vs</div>

            <div className="flex-1">
              {renderPartnership(otherPartnership, challenge.winner_partnership_id === otherPartnership.id)}
            </div>

            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${
                challenge.status === 'completed' 
                  ? 'bg-green-50 text-green-600 border-green-200' 
                  : challenge.status === 'pending'
                  ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                  : 'bg-blue-50 text-blue-600 border-blue-200'
              }`}>
                {challenge.status === 'completed' ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <CircleDot className="h-3 w-3" />
                )}
                {challenge.status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
            <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
              {challenge.league.name}
            </Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span>{format(new Date(challenge.proposed_time), 'PPp')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-gray-500" />
              <span>Duo Match</span>
            </div>
          </div>

          {renderScores()}
          
          {challenge.status === 'pending' && type === 'received' && onResponse && (
            <div className="flex justify-end gap-2 mt-2">
              <ChallengeStatus 
                challenge={challenge} 
                type={type} 
                onResponse={onResponse}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
