import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";

interface PlayerStats {
  id: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  profiles: {
    username: string;
  } | null;
}

interface TournamentStatsProps {
  playerStats: PlayerStats[];
  isLoading: boolean;
}

export const TournamentStats = ({ playerStats, isLoading }: TournamentStatsProps) => {
  const formattedPlayerStats = playerStats?.map(player => ({
    id: Number(player.id), // Convert string id to number
    name: player.profiles?.username || 'Unknown Player',
    rank: player.rank,
    wins: player.wins,
    losses: player.losses,
    points: player.points
  }));

  return (
    <Card className="bg-white/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-500" />
          Player Rankings & Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center">Loading player statistics...</div>
        ) : (
          <PlayerRankingsTable players={formattedPlayerStats} />
        )}
      </CardContent>
    </Card>
  );
};