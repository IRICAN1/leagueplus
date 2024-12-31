import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award, Medal, Swords, UserRound } from "lucide-react";
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
      <Card className="bg-white/80 shadow-md">
        <CardHeader>
          <CardTitle>Player Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
            <UserRound className="h-12 w-12 text-muted" />
            <p>No player rankings available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100/50 font-semibold text-yellow-700";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100/50 font-semibold text-gray-700";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100/50 font-semibold text-amber-800";
      default:
        return "hover:bg-gray-50/50";
    }
  };

  return (
    <Card className="bg-white/80 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          Player Rankings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
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
                className={`${getRankStyle(player.rank)} transition-all duration-300 hover:shadow-sm`}
              >
                <TableCell className="font-medium">
                  {player.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-1" />}
                  #{player.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform hover:scale-105">
                      <AvatarImage 
                        src={player.avatar_url} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-blue-700">
                        {player.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{player.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {player.points} total points
                      </span>
                    </div>
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
                <TableCell className="text-right font-medium">
                  <span className="text-green-600">{player.wins}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-red-600">{player.losses}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium text-sm">
                    {player.points}
                  </span>
                </TableCell>
                <TableCell>
                  {currentUserId && player.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 transition-colors"
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