import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";

interface TournamentStatsProps {
  playerStats: any[];
  isLoading: boolean;
}

export const TournamentStats = ({ playerStats, isLoading }: TournamentStatsProps) => {
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
          <PlayerRankingsTable players={playerStats} />
        )}
      </CardContent>
    </Card>
  );
};