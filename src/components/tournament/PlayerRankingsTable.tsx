import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Swords, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Player } from "./types";
import { PlayerAchievementsList } from "./PlayerAchievementsList";
import { PlayerProfile } from "./PlayerProfile";
import { RankDisplay } from "./RankDisplay";

interface PlayerRankingsTableProps {
  players: Player[];
  leagueId: string;
}

export const PlayerRankingsTable = ({ players, leagueId }: PlayerRankingsTableProps) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
      }
    };
    checkUser();
  }, []);

  const handleChallenge = (playerId: string, playerName: string) => {
    navigate(`/player-challenge/${playerId}`, {
      state: { 
        playerName,
        leagueId,
        fromTournament: true
      }
    });
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 via-yellow-100/50 to-amber-50 font-semibold text-yellow-700 hover:from-yellow-100 hover:to-amber-100/50";
      case 2:
        return "bg-gradient-to-r from-gray-50 via-slate-100/50 to-gray-50 font-semibold text-gray-700 hover:from-gray-100 hover:to-slate-100/50";
      case 3:
        return "bg-gradient-to-r from-amber-50 via-orange-100/50 to-amber-50 font-semibold text-amber-800 hover:from-amber-100 hover:to-orange-100/50";
      default:
        return "hover:bg-gray-50/50 transition-colors duration-200";
    }
  };

  if (!players || players.length === 0) {
    return (
      <Card className="bg-white/80 shadow-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
            <UserRound className="h-12 w-12 text-muted animate-pulse" />
            <p>No player rankings available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-blue-100/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 hover:from-blue-100 hover:to-purple-100">
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Achievements</TableHead>
              <TableHead className="text-right">W/L</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
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
                  <span className="text-green-600">{player.wins}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-red-600">{player.losses}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-medium text-sm group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                    {player.points}
                  </span>
                </TableCell>
                <TableCell>
                  {currentUserId && player.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 transition-colors group-hover:border-blue-300"
                      onClick={() => handleChallenge(player.id, player.name)}
                    >
                      <Swords className="h-4 w-4 mr-1" />
                      Challenge
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};