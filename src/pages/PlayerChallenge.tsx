import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const { playerName, leagueId, fromTournament } = location.state || {};

  const { data: player, isLoading } = useQuery({
    queryKey: ['player', playerId],
    queryFn: async () => {
      if (!playerId) return null;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', playerId)
        .single();

      if (error) throw error;
      return {
        ...profile,
        name: playerName || profile.username,
        leagueId
      };
    },
    enabled: !!playerId
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!player) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Player not found. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <PlayerProfile player={player} />
        <LocationSelector player={player} />
        <WeeklySchedule player={player} />
      </Card>
    </div>
  );
};

export default PlayerChallenge;