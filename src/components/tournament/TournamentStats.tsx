import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Medal } from "lucide-react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";
import { Tables } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PlayerStatWithProfile = Tables<"player_statistics"> & {
  profiles: Pick<Tables<"profiles">, "username">;
};

interface TournamentStatsProps {
  playerStats: PlayerStatWithProfile[] | null;
  isLoading: boolean;
}

export const TournamentStats = ({ playerStats, isLoading }: TournamentStatsProps) => {
  if (!playerStats && !isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              No player statistics available for this tournament.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formattedPlayerStats = playerStats?.map(player => ({
    id: player.id,
    name: player.profiles?.username || 'Unknown Player',
    rank: player.rank,
    wins: player.wins,
    losses: player.losses,
    points: player.points,
    achievements: player.points > 100 ? [
      { title: "High Scorer", icon: Medal }
    ] : undefined
  })) || [];

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">Loading rankings...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 overflow-hidden bg-gradient-to-br from-white to-gray-50/80 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-600/10 via-blue-500/10 to-purple-600/10 border-b border-blue-100">
        <CardTitle className="flex items-center gap-3 text-lg font-bold">
          <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md">
            <Trophy className="h-5 w-5 animate-pulse-soft" />
          </div>
          <span className="bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
            Tournament Rankings
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <PlayerRankingsTable players={formattedPlayerStats} />
      </CardContent>
    </Card>
  );
};