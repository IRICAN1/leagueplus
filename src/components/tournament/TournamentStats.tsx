import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";
import { Tables } from "@/integrations/supabase/types";

type PlayerStatWithProfile = Tables<"player_statistics"> & {
  profiles: Tables<"profiles"> | null;
};

interface TournamentStatsProps {
  playerStats: PlayerStatWithProfile[] | null;
  isLoading: boolean;
}

export const TournamentStats = ({ playerStats, isLoading }: TournamentStatsProps) => {
  const formattedPlayerStats = playerStats?.map(player => ({
    id: player.id,  // Keep as string, no conversion needed
    name: player.profiles?.username || 'Unknown Player',
    rank: player.rank,
    wins: player.wins,
    losses: player.losses,
    points: player.points
  })) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Player Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlayerRankingsTable players={formattedPlayerStats} />
      </CardContent>
    </Card>
  );
};