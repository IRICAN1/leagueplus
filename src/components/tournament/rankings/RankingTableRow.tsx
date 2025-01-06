import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { PlayerProfile } from "../PlayerProfile";
import { PlayerAchievementsList } from "../PlayerAchievementsList";
import { RankDisplay } from "../RankDisplay";
import { Player } from "../types";

interface RankingTableRowProps {
  player: Player;
  currentUserId: string | null;
  onChallenge: (playerId: string, playerName: string) => void;
  getRankStyle: (rank: number) => string;
  sortBy: "points" | "matches";
}

export const RankingTableRow = ({ 
  player, 
  currentUserId, 
  onChallenge, 
  getRankStyle,
  sortBy
}: RankingTableRowProps) => {
  const winRate = player.matches_played > 0 
    ? ((player.wins / player.matches_played) * 100).toFixed(1)
    : "0.0";

  return (
    <TableRow 
      key={player.id}
      className={`${getRankStyle(player.rank)} transition-all duration-300 hover:shadow-md group animate-fade-in`}
    >
      <TableCell>
        <RankDisplay rank={player.rank} />
      </TableCell>
      <TableCell>
        <PlayerProfile player={player} />
      </TableCell>
      <TableCell>
        <PlayerAchievementsList player={player} />
      </TableCell>
      <TableCell className="text-right font-medium">
        {sortBy === "points" ? (
          <>
            <span className="text-green-600">{player.wins}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span className="text-red-600">{player.losses}</span>
          </>
        ) : (
          <span className="text-blue-600">{player.matches_played}</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-medium text-sm group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
          {sortBy === "points" ? player.points : `${winRate}%`}
        </span>
      </TableCell>
      <TableCell>
        {currentUserId && player.id !== currentUserId && (
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 transition-colors group-hover:border-blue-300"
            onClick={() => onChallenge(player.id, player.name)}
          >
            <Swords className="h-4 w-4 mr-1" />
            Challenge
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};