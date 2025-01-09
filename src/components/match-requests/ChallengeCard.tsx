import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Users, CircleDot, MessageSquare, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeDetails } from "./ChallengeDetails";
import { ChallengeStatus } from "./ChallengeStatus";
import { Challenge, ChallengeType } from "@/types/match";
import { MessageButton } from "./MessageButton";
import { MatchScoresTable } from "./MatchScoresTable";
import { MatchActions } from "./MatchActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChallengeCardProps {
  challenge: Challenge & { challengeType?: ChallengeType };
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeCard = ({ challenge, type, onResponse }: ChallengeCardProps) => {
  const currentUserId = type === 'sent' ? challenge.challenger_id : challenge.challenged_id;
  const otherUserId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;

  const parseScore = (score: string | null) => {
    if (!score) return [];
    return score.split('-').map(set => set.trim());
  };

  const renderScores = () => {
    if (challenge.status !== 'completed' || !challenge.winner_score) return null;
    const isWinner = challenge.winner_id === currentUserId;
    const winnerName = isWinner 
      ? challenge.challenger.username
      : challenge.challenged.username;
    const loserName = !isWinner 
      ? challenge.challenger.username
      : challenge.challenged.username;
    const winnerSets = parseScore(challenge.winner_score);
    const loserSets = parseScore(challenge.loser_score);

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in border-l-4 border-l-blue-400 hover:scale-[1.01] bg-white/80">
      <CardContent className="p-2 sm:p-3 bg-gradient-to-r from-gray-50/90 via-blue-50/50 to-gray-50/90">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-blue-100">
                <AvatarImage src={challenge.challenger.avatar_url || undefined} />
                <AvatarFallback className="bg-blue-50 text-blue-600">
                  {challenge.challenger.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{challenge.challenger.username}</span>
              <span className="text-xs text-gray-500">vs</span>
              <Avatar className="h-8 w-8 border-2 border-purple-100">
                <AvatarImage src={challenge.challenged.avatar_url || undefined} />
                <AvatarFallback className="bg-purple-50 text-purple-600">
                  {challenge.challenged.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{challenge.challenged.username}</span>
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
              </Badge>
              <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${
                type === 'sent' 
                  ? 'bg-purple-50 text-purple-600 border-purple-200'
                  : 'bg-pink-50 text-pink-600 border-pink-200'
              }`}>
                {type}
              </Badge>
              <MessageButton
                currentUserId={currentUserId}
                otherUserId={otherUserId}
                challengeId={challenge.id}
                compact={true}
              />
            </div>
          </div>

          <ChallengeDetails challenge={challenge} />
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