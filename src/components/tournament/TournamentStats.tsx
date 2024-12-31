import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Medal } from "lucide-react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";
import { Tables } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PlayerStatWithProfile = Tables<"player_statistics", never> & {
  profiles: Pick<Tables<"profiles", never>, "username">;
};

interface TournamentStatsProps {
  playerStats: PlayerStatWithProfile[] | null;
  isLoading: boolean;
  leagueId: string;
}

export const TournamentStats = ({ playerStats, isLoading, leagueId }: TournamentStatsProps) => {
  if (!playerStats && !isLoading) {
    return (
      <Card className="mt-6 bg-gradient-to-br from-gray-50 to-white/80 shadow-lg">
        <CardContent className="p-6">
          <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
            <AlertDescription className="text-blue-600">
              No player statistics available for this tournament.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formattedPlayerStats = playerStats?.map(player => ({
    id: player.player_id,
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
      <Card className="mt-6 bg-gradient-to-br from-gray-50 to-white/80 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">
              <Trophy className="h-8 w-8 animate-bounce text-blue-500 mb-2" />
              <span className="text-sm font-medium">Loading rankings...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 overflow-hidden bg-gradient-to-br from-white to-gray-50/80 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="relative overflow-hidden border-b border-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-500/10 to-purple-600/5 animate-pulse-soft" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-purple-100/10 to-transparent" />
        <CardTitle className="relative flex items-center gap-3 text-lg font-bold">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md transform transition-transform duration-300 hover:scale-110">
              <Trophy className="h-5 w-5 animate-pulse-soft" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent font-extrabold text-xl">
              Tournament Rankings
            </span>
            <span className="text-sm text-gray-500 font-normal">
              Track your progress and compete with others
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-purple-50/30 pointer-events-none" />
        <div className="relative">
          <PlayerRankingsTable players={formattedPlayerStats} leagueId={leagueId} />
        </div>
      </CardContent>
    </Card>
  );
};