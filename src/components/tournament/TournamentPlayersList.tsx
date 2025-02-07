
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User } from "lucide-react";

interface TournamentPlayersListProps {
  leagueId: string;
  isDuo?: boolean;
}

export const TournamentPlayersList = ({ leagueId, isDuo }: TournamentPlayersListProps) => {
  const { data: players, isLoading } = useQuery({
    queryKey: ['tournament-players', leagueId, isDuo],
    queryFn: async () => {
      if (isDuo) {
        const { data, error } = await supabase
          .from('duo_league_participants')
          .select(`
            duo_partnership:duo_partnerships!inner (
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
              )
            )
          `)
          .eq('league_id', leagueId);

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
            skill_level
          )
        `)
        .eq('league_id', leagueId);

      if (error) throw error;
      return data;
    }
  });

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isDuo ? (
            players.map((participant: any) => (
              <div key={participant.duo_partnership.id} className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.duo_partnership.player1.avatar_url} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {participant.duo_partnership.player1.full_name || participant.duo_partnership.player1.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {participant.duo_partnership.player1.primary_location || 'No location'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.duo_partnership.player2.avatar_url} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {participant.duo_partnership.player2.full_name || participant.duo_partnership.player2.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {participant.duo_partnership.player2.primary_location || 'No location'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            players.map((participant: any) => (
              <div key={participant.user.id} className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={participant.user.avatar_url} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {participant.user.full_name || participant.user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {participant.user.primary_location || 'No location'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
