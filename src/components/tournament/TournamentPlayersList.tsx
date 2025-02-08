import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Trophy, Swords } from "lucide-react";
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No players found in this tournament.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 hover:from-blue-100 hover:to-purple-100">
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Players</TableHead>
                <TableHead className="text-right">W/L</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDuo ? (
                players.map((participant: any) => {
                  const stats = participant.duo_partnership.duo_statistics?.[0] || { wins: 0, losses: 0, rank: 999999, points: 0 };
                  const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100 || 0).toFixed(1);
                  const duoName = `${participant.duo_partnership.player1.full_name || participant.duo_partnership.player1.username} & ${participant.duo_partnership.player2.full_name || participant.duo_partnership.player2.username}`;
                  const showRank = stats.rank !== 999999 && (stats.wins > 0 || stats.losses > 0);
                  
                  return (
                    <TableRow 
                      key={participant.duo_partnership.id}
                      className="hover:bg-gray-50/50 transition-all duration-300"
                    >
                      <TableCell>
                        <RankDisplay rank={showRank ? stats.rank : '-'} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex -space-x-2">
                            <Avatar className="h-10 w-10 border-2 border-white">
                              <AvatarImage src={participant.duo_partnership.player1.avatar_url} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <Avatar className="h-10 w-10 border-2 border-white">
                              <AvatarImage src={participant.duo_partnership.player2.avatar_url} />
                              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <div className="font-medium">{duoName}</div>
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
                      <TableCell className="text-right font-medium">
                        {stats.points || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-none">
                          {winRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user && participant.duo_partnership.player1.id !== user.id && participant.duo_partnership.player2.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                            onClick={() => handleChallenge(participant.duo_partnership.id, duoName)}
                          >
                            <Swords className="h-4 w-4 mr-1" />
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

                  return (
                    <TableRow key={participant.user.id}>
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
                      <TableCell className="text-right font-medium">
                        {stats.points}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-none">
                          {winRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user && participant.user.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                            onClick={() => handleChallenge(participant.user.id, participant.user.full_name || participant.user.username)}
                          >
                            <Swords className="h-4 w-4 mr-1" />
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
