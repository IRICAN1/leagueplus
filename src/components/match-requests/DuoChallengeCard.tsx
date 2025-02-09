
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, CircleDot, Check, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MatchScoresTable } from "./MatchScoresTable";
import { Button } from "@/components/ui/button";
import { DuoMatchScoreDialog } from "./DuoMatchScoreDialog";
import { DuoScoreApprovalCard } from "./DuoScoreApprovalCard";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DuoChallenge, ChallengeType } from "@/types/match";

interface DuoChallengeCardProps {
  challenge: DuoChallenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const DuoChallengeCard = ({ challenge, type, onResponse }: DuoChallengeCardProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const currentPartnership = type === 'sent' ? challenge.challenger_partnership : challenge.challenged_partnership;
  const otherPartnership = type === 'sent' ? challenge.challenged_partnership : challenge.challenger_partnership;

  const parseScore = (score: string | null) => {
    if (!score) return [];
    return score.split('-').map(set => set.trim());
  };

  const renderScores = () => {
    if (challenge.status !== 'completed' || !challenge.winner_partnership_id) return null;
    
    const isWinner = challenge.winner_partnership_id === currentPartnership.id;
    const winnerTeam = `${isWinner ? currentPartnership.player1.full_name : otherPartnership.player1.full_name} & ${isWinner ? currentPartnership.player2.full_name : otherPartnership.player2.full_name}`;
    const loserTeam = `${!isWinner ? currentPartnership.player1.full_name : otherPartnership.player1.full_name} & ${!isWinner ? currentPartnership.player2.full_name : otherPartnership.player2.full_name}`;
    
    let winnerSets = parseScore(challenge.winner_score);
    let loserSets = parseScore(challenge.loser_score);

    // Add third set scores if they exist
    if (challenge.winner_score_set3 && challenge.loser_score_set3) {
      winnerSets.push(challenge.winner_score_set3);
      loserSets.push(challenge.loser_score_set3);
    }

    return (
      <div className="mt-3 p-2 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium mb-2">Match Score:</h4>
        <MatchScoresTable
          winnerName={winnerTeam}
          loserName={loserTeam}
          winnerSets={winnerSets}
          loserSets={loserSets}
        />
      </div>
    );
  };

  const renderPartnership = (partnership: DuoChallenge['challenger_partnership'], isWinner?: boolean) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <Avatar className="h-8 w-8 border-2 border-blue-100">
            <AvatarImage src={partnership.player1.avatar_url || undefined} />
            <AvatarFallback>{partnership.player1.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8 border-2 border-purple-100">
            <AvatarImage src={partnership.player2.avatar_url || undefined} />
            <AvatarFallback>{partnership.player2.full_name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium line-clamp-1">
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

  // Check if the current user belongs to either partnership
  const isParticipant = currentUserId && (
    currentPartnership.player1.id === currentUserId ||
    currentPartnership.player2.id === currentUserId ||
    otherPartnership.player1.id === currentUserId ||
    otherPartnership.player2.id === currentUserId
  );

  // Check if the match time has passed
  const matchTime = new Date(challenge.proposed_time);
  const now = new Date();
  const canSubmitScore = isParticipant && 
    challenge.status === 'accepted' && 
    matchTime <= now && 
    !challenge.winner_partnership_id;

  const handleScoreApproved = () => {
    console.log('Score approved for challenge:', challenge.id);
    // Refetch the data by calling onResponse if it exists
    if (onResponse) {
      onResponse(challenge.id, true);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in border-l-4 border-l-blue-400 hover:scale-[1.01] bg-white/80">
      <CardContent className="p-2 sm:p-3 bg-gradient-to-r from-gray-50/90 via-blue-50/50 to-gray-50/90">
        <div className="space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex-1">
              {renderPartnership(currentPartnership, challenge.winner_partnership_id === currentPartnership.id)}
            </div>

            <div className="text-sm font-medium text-gray-500 self-center">vs</div>

            <div className="flex-1">
              {renderPartnership(otherPartnership, challenge.winner_partnership_id === otherPartnership.id)}
            </div>

            <Badge variant="outline" className={`text-xs px-1.5 py-0.5 self-start sm:self-center whitespace-nowrap ${
              challenge.status === 'completed' 
                ? 'bg-green-50 text-green-600 border-green-200' 
                : challenge.status === 'pending'
                ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              {challenge.status === 'completed' ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <CircleDot className="h-3 w-3 mr-1" />
              )}
              {challenge.status}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-2">
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
              <Button 
                variant="outline" 
                onClick={() => onResponse(challenge.id, false)}
                className="text-red-600 border-red-200 hover:bg-red-50"
                size="sm"
              >
                Decline
              </Button>
              <Button 
                onClick={() => onResponse(challenge.id, true)}
                className="bg-green-600 text-white hover:bg-green-700"
                size="sm"
              >
                Accept
              </Button>
            </div>
          )}

          {canSubmitScore && currentUserId && (
            <DuoMatchScoreDialog challenge={challenge} currentUserId={currentUserId} />
          )}

          {challenge.status === 'completed' && challenge.result_status === 'pending' && (
            <DuoScoreApprovalCard 
              challenge={challenge} 
              currentUserId={currentUserId} 
              onScoreApproved={handleScoreApproved}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
