
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Trophy, Swords, Award, Medal, Crown, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlayerProfile } from "./PlayerProfile";
import { RankDisplay } from "./RankDisplay";

interface TournamentPlayersListProps {
  leagueId: string;
  isDuo?: boolean;
}

export const TournamentPlayersList = ({ leagueId, isDuo }: TournamentPlayersListProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: players, isLoading } = useQuery({
    queryKey: ['tournament-players', leagueId, isDuo],
    queryFn: async () => {
      if (isDuo) {
        const { data, error } = await supabase
          .from('duo_league_participants')
          .select(`
            duo_partnership:duo_partnerships!inner (
              id,
              player1:profiles!duo_partnerships_player1_id_fkey (
                id,
                username,
                full_name,
                avatar_url,
                primary_location,
                skill_level
              ),
              player2:profiles!duo_partnerships_player2_id_fkey (
                id,
                username,
                full_name,
                avatar_url,
                primary_location,
                skill_level
              ),
              duo_statistics (
                wins,
                losses,
                rank,
                points
              )
            )
          `)
          .eq('league_id', leagueId)
          .order('joined_at', { ascending: true });

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('league_participants')
        .select(`
          user:profiles!inner (
            id,
            username,
            full_name,
            avatar_url,
            primary_location,
            skill_level,
            player_statistics!player_statistics_player_id_fkey(
              wins,
              losses,
              points,
              rank
            )
          )
        `)
        .eq('league_id', leagueId);

      if (error) throw error;
      return data;
    }
  });

  const handleChallenge = (partnershipId: string, name: string) => {
    navigate(`/player-challenge/${partnershipId}`, {
      state: { playerName: name, leagueId }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100">
        <CardContent className="p-8">
          <div className="text-center space-y-3">
            <Users className="h-12 w-12 text-blue-400 mx-auto animate-pulse" />
            <div className="text-lg text-muted-foreground">
              No players found in this tournament.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100/50 overflow-hidden animate-fade-in">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 hover:from-blue-100 hover:to-purple-100">
                <TableHead className="w-[100px] font-semibold">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-blue-500" />
                    Rank
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    Players
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold">
                  <div className="flex items-center justify-end gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    W/L
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold">
                  <div className="flex items-center justify-end gap-2">
                    <Medal className="h-4 w-4 text-blue-500" />
                    Points
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold">Win Rate</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDuo ? (
                players.map((participant: any) => {
                  const stats = participant.duo_partnership.duo_statistics?.[0] || { wins: 0, losses: 0, rank: 999999, points: 0 };
                  const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100 || 0).toFixed(1);
                  const duoName = `${participant.duo_partnership.player1.full_name || participant.duo_partnership.player1.username} & ${participant.duo_partnership.player2.full_name || participant.duo_partnership.player2.username}`;
                  const showRank = stats.rank !== 999999 && (stats.wins > 0 || stats.losses > 0 || stats.points > 0);
                  const isTopRank = showRank && stats.rank <= 3;
                  
                  return (
                    <TableRow 
                      key={participant.duo_partnership.id}
                      className={`group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 ${
                        isTopRank ? 'bg-gradient-to-r from-yellow-50/30 to-amber-50/30' : ''
                      }`}
                    >
                      <TableCell>
                        <RankDisplay rank={showRank ? stats.rank : '-'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex -space-x-2 group-hover:space-x-1 transition-all duration-300">
                            <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                              <AvatarImage src={participant.duo_partnership.player1.avatar_url} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <Avatar className="h-10 w-10 border-2 border-white ring-2 ring-purple-100 group-hover:ring-purple-200 transition-all duration-300">
                              <AvatarImage src={participant.duo_partnership.player2.avatar_url} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="font-medium group-hover:text-blue-600 transition-colors">{duoName}</div>
                            <div className="text-sm text-muted-foreground">
                              {participant.duo_partnership.player1.primary_location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className="text-green-600">{stats.wins}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-red-600">{stats.losses}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-600 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                          {stats.points || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 border-none text-blue-700 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                          {winRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user && participant.duo_partnership.player1.id !== user.id && participant.duo_partnership.player2.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 group-hover:border-blue-300 transition-all duration-300"
                            onClick={() => handleChallenge(participant.duo_partnership.id, duoName)}
                          >
                            <Swords className="h-4 w-4 mr-1 group-hover:animate-[cross-swords_0.3s_ease-out_forwards]" />
                            Challenge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                players.map((participant: any) => {
                  const stats = participant.user.player_statistics?.[0] || { wins: 0, losses: 0, points: 0, rank: '-' };
                  const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100 || 0).toFixed(1);
                  const isTopRank = stats.rank <= 3;

                  return (
                    <TableRow 
                      key={participant.user.id}
                      className={`group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 ${
                        isTopRank ? 'bg-gradient-to-r from-yellow-50/30 to-amber-50/30' : ''
                      }`}
                    >
                      <TableCell>
                        <RankDisplay rank={stats.rank} />
                      </TableCell>
                      <TableCell>
                        <PlayerProfile player={participant.user} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className="text-green-600">{stats.wins}</span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-red-600">{stats.losses}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-600 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
                          {stats.points}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 border-none text-blue-700 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                          {winRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user && participant.user.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 group-hover:border-blue-300 transition-all duration-300"
                            onClick={() => handleChallenge(participant.user.id, participant.user.full_name || participant.user.username)}
                          >
                            <Swords className="h-4 w-4 mr-1 group-hover:animate-[cross-swords_0.3s_ease-out_forwards]" />
                            Challenge
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
