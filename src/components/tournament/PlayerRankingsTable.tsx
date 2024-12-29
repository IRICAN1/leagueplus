import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { Link } from "react-router-dom";
import { PlayerAchievementBadge } from "./PlayerAchievementBadge";

interface Player {
  id: number;
  name: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  achievements: Array<{
    title: string;
    icon: any;
  }>;
}

interface PlayerRankingsTableProps {
  players: Player[];
}

export const PlayerRankingsTable = ({ players }: PlayerRankingsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Player</TableHead>
          <TableHead className="w-48">Achievements</TableHead>
          <TableHead className="text-right w-20">Wins</TableHead>
          <TableHead className="text-right w-20">Losses</TableHead>
          <TableHead className="text-right w-20">Points</TableHead>
          <TableHead className="w-32"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="font-bold text-blue-600">
              #{player.rank}
            </TableCell>
            <TableCell className="font-semibold">
              {player.name}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                {player.achievements.map((achievement, index) => (
                  <PlayerAchievementBadge key={index} achievement={achievement} />
                ))}
              </div>
            </TableCell>
            <TableCell className="text-right font-medium text-green-600">
              {player.wins}
            </TableCell>
            <TableCell className="text-right font-medium text-red-600">
              {player.losses}
            </TableCell>
            <TableCell className="text-right font-medium text-blue-600">
              {player.points}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200"
                asChild
              >
                <Link to={`/player-challenge/${player.id}`}>
                  <Swords className="h-4 w-4 mr-2" />
                  Challenge
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};