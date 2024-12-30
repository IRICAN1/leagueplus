import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award, Medal, Swords } from "lucide-react";
import { PlayerAchievementBadge } from "./PlayerAchievementBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface Achievement {
  title: string;
  icon: typeof Trophy | typeof Award | typeof Medal;
}

export interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  achievements?: Achievement[];
  avatar_url?: string;
}

interface PlayerRankingsTableProps {
  players: Player[];
}

export const PlayerRankingsTable = ({ players }: PlayerRankingsTableProps) => {
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

  const handleChallenge = (playerId: string) => {
    navigate(`/player-challenge/${playerId}`);
  };

  if (!players || players.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Player Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No player rankings available
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 font-semibold text-yellow-600";
      case 2:
        return "bg-gray-50 font-semibold text-gray-600";
      case 3:
        return "bg-amber-50 font-semibold text-amber-700";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          Player Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
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
                className={`${getRankStyle(player.rank)} transition-colors hover:bg-muted/50`}
              >
                <TableCell className="font-medium">
                  {player.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />}
                  #{player.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={player.avatar_url} />
                      <AvatarFallback>
                        {player.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{player.name}</span>
                  </div>
                </TableCell>
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
                  <span className="text-green-600 font-medium">{player.wins}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-red-600 font-medium">{player.losses}</span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {player.points}
                </TableCell>
                <TableCell>
                  {currentUserId && player.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleChallenge(player.id)}
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