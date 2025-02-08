
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Trophy, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
                rank
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
      <CardContent className="p-6">
        <div className="grid gap-4">
          {isDuo ? (
            players.map((participant: any) => {
              const stats = participant.duo_partnership.duo_statistics?.[0] || { wins: 0, losses: 0, rank: 999999 };
              const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100 || 0).toFixed(1);
              const duoName = `${participant.duo_partnership.player1.full_name || participant.duo_partnership.player1.username} & ${participant.duo_partnership.player2.full_name || participant.duo_partnership.player2.username}`;
              const showRank = stats.rank !== 999999 && (stats.wins > 0 || stats.losses > 0);
              
              return (
                <div 
                  key={participant.duo_partnership.id} 
                  className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 rounded-lg space-y-4 hover:from-blue-100/50 hover:to-purple-100/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        <Avatar className="h-12 w-12 border-2 border-white">
                          <AvatarImage src={participant.duo_partnership.player1.avatar_url} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <Avatar className="h-12 w-12 border-2 border-white">
                          <AvatarImage src={participant.duo_partnership.player2.avatar_url} />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="font-medium text-lg flex items-center gap-2">
                          {duoName}
                          {showRank && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-none">
                              <Trophy className="h-3 w-3 mr-1" />
                              Rank #{stats.rank}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          {participant.duo_partnership.player1.primary_location && (
                            <span>{participant.duo_partnership.player1.primary_location}</span>
                          )}
                          {participant.duo_partnership.player1.skill_level && (
                            <Badge variant="secondary">Level {participant.duo_partnership.player1.skill_level}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{stats.wins}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-red-600 font-medium">{stats.losses}</span>
                      </div>
                      <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-none">
                        {winRate}% Win Rate
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-muted">
                    <div className="flex items-center gap-2">
                      <Swords className="h-4 w-4 text-blue-600" />
                      <span>{stats.wins + stats.losses} matches played</span>
                    </div>
                    {user && participant.duo_partnership.player1.id !== user.id && participant.duo_partnership.player2.id !== user.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                        onClick={() => handleChallenge(participant.duo_partnership.id, duoName)}
                      >
                        <Swords className="h-4 w-4 mr-1" />
                        Challenge
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            players.map((participant: any) => {
              const stats = participant.user.player_statistics?.[0] || { wins: 0, losses: 0, points: 0, rank: '-' };
              const winRate = ((stats.wins / (stats.wins + stats.losses)) * 100 || 0).toFixed(1);

              return (
                <div 
                  key={participant.user.id}
                  className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 rounded-lg hover:from-blue-100/50 hover:to-purple-100/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src={participant.user.avatar_url} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-lg">
                          {participant.user.full_name || participant.user.username}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          {participant.user.primary_location && (
                            <span>{participant.user.primary_location}</span>
                          )}
                          {participant.user.skill_level && (
                            <Badge variant="secondary">Level {participant.user.skill_level}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">{stats.wins}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-red-600 font-medium">{stats.losses}</span>
                      </div>
                      <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-none">
                        {winRate}% Win Rate
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-4 pt-2 border-t border-muted">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Swords className="h-4 w-4 text-blue-600" />
                        <span>{stats.wins + stats.losses} matches played</span>
                      </div>
                      {stats.rank !== '-' && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span>Rank #{stats.rank}</span>
                        </div>
                      )}
                    </div>
                    {stats.points > 0 && (
                      <Badge variant="outline" className="bg-purple-50">
                        {stats.points} points
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
