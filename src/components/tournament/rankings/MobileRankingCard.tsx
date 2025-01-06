import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { PlayerProfile } from "../PlayerProfile";
import { RankDisplay } from "../RankDisplay";
import { Player } from "../types";

interface MobileRankingCardProps {
  player: Player;
  currentUserId: string | null;
  onChallenge: (playerId: string, playerName: string) => void;
  getRankStyle: (rank: number) => string;
}

export const MobileRankingCard = ({
  player,
  currentUserId,
  onChallenge,
  getRankStyle
}: MobileRankingCardProps) => (
  <div 
    key={player.id}
    className={`${getRankStyle(player.rank)} p-4 rounded-lg animate-fade-in`}
  >
    <div className="flex items-center justify-between mb-2">
      <RankDisplay rank={player.rank} />
      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-medium text-sm">
        {player.points} pts
      </span>
    </div>
    <PlayerProfile player={player} />
    <div className="mt-2 flex items-center justify-between">
      <div className="text-sm font-medium">
        <span className="text-green-600">{player.wins}</span>
        <span className="text-muted-foreground mx-1">/</span>
        <span className="text-red-600">{player.losses}</span>
      </div>
      {currentUserId && player.id !== currentUserId && (
        <Button
          size="sm"
          variant="outline"
          className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
          onClick={() => onChallenge(player.id, player.name)}
        >
          <Swords className="h-4 w-4 mr-1" />
          Challenge
        </Button>
      )}
    </div>
  </div>
);