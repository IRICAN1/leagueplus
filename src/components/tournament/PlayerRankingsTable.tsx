import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Award, Medal, Swords, UserRound, Crown, Star, Flame } from "lucide-react";
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

  const getPlayerAchievements = (player: Player) => {
    const achievements: Achievement[] = [];
    
    // Top 3 achievements
    if (player.rank === 1) achievements.push({ title: "Champion", icon: Crown });
    if (player.rank === 2) achievements.push({ title: "Runner Up", icon: Medal });
    if (player.rank === 3) achievements.push({ title: "Bronze", icon: Medal });
    
    // Win-based achievements
    if (player.wins >= 10) achievements.push({ title: "Victory Master", icon: Trophy });
    if (player.wins >= 5) achievements.push({ title: "Rising Star", icon: Star });
    
    // Points-based achievements
    if (player.points >= 100) achievements.push({ title: "Point Leader", icon: Flame });
    
    return achievements;
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
                <TableCell className="font-medium">
                  {player.rank === 1 && <Crown className="h-5 w-5 text-yellow-500 inline mr-1 animate-pulse-soft" />}
                  {player.rank === 2 && <Medal className="h-5 w-5 text-gray-400 inline mr-1" />}
                  {player.rank === 3 && <Medal className="h-5 w-5 text-amber-500 inline mr-1" />}
                  #{player.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                      <AvatarImage 
                        src={player.avatar_url} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-medium">
                        {player.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {player.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {player.points} total points
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {getPlayerAchievements(player).map((achievement, index) => (
                      <PlayerAchievementBadge
                        key={index}
                        achievement={achievement}
                      />
                    ))}
                  </div>
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