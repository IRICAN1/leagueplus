import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award } from "lucide-react";
import { PlayerAchievementBadge } from "./PlayerAchievementBadge";

export interface Achievement {
  title: string;
  icon: typeof Trophy | typeof Award;
}

export interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  achievements?: Achievement[];
}

interface PlayerRankingsTableProps {
  players: Player[];
}

export const PlayerRankingsTable = ({ players }: PlayerRankingsTableProps) => {
  if (!players || players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No player rankings available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Player</TableHead>
          <TableHead>Achievements</TableHead>
          <TableHead className="text-right">W/L</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-medium">#{player.rank}</TableCell>
            <TableCell>{player.name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {player.achievements?.map((achievement, index) => (
                  <PlayerAchievementBadge
                    key={index}
                    achievement={achievement}
                  />
                )) ?? null}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {player.wins}/{player.losses}
            </TableCell>
            <TableCell className="text-right">{player.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};