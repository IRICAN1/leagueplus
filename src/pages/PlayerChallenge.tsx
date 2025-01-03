import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { ChallengeConfirmationDialog } from "@/components/player-challenge/ChallengeConfirmationDialog";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Trophy, Award, Medal, Crown, Star, Flame, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AvailabilitySchedule {
  selectedSlots: string[];
}

const isAvailabilitySchedule = (json: any): json is { selectedSlots: string[] } => {
  if (!json || typeof json !== 'object') return false;
  return Array.isArray((json as { selectedSlots?: unknown }).selectedSlots);
};

const getPlayerAchievements = (rank: number, wins: number, points: number) => {
  const achievements = [];
  
  if (rank === 1) achievements.push({ title: "Champion", icon: Crown });
  if (rank === 2) achievements.push({ title: "Runner Up", icon: Medal });
  if (rank === 3) achievements.push({ title: "Bronze", icon: Medal });
  if (wins >= 10) achievements.push({ title: "Victory Master", icon: Trophy });
  if (wins >= 5) achievements.push({ title: "Rising Star", icon: Star });
  if (points >= 100) achievements.push({ title: "Point Leader", icon: Flame });
  
  return achievements;
};

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const { playerName, leagueId, fromTournament } = location.state || {};
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const { data: playerData, isLoading } = useQuery({
    queryKey: ['player', playerId, leagueId],
    queryFn: async () => {
      if (!playerId || !leagueId) return null;

      const [profileResponse, statsResponse, leagueResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', playerId)
          .single(),
        supabase
          .from('player_statistics')
          .select('*')
          .eq('player_id', playerId)
          .eq('league_id', leagueId)
          .single(),
        supabase
          .from('leagues')
          .select('name')
          .eq('id', leagueId)
          .single()
      ]);

      if (profileResponse.error) throw profileResponse.error;
      if (leagueResponse.error) throw leagueResponse.error;

      const stats = statsResponse.data || {
        rank: 0,
        wins: 0,
        losses: 0,
        points: 0
      };

      return {
        ...profileResponse.data,
        name: profileResponse.data.full_name || profileResponse.data.username,
        rank: stats.rank,
        wins: stats.wins,
        losses: stats.losses,
        points: stats.points,
        leagueName: leagueResponse.data.name,
        leagueId
      };
    },
    enabled: !!playerId && !!leagueId
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!playerData) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Player not found. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const playerDataWithAchievements = {
    ...playerData,
    achievements: getPlayerAchievements(playerData.rank, playerData.wins, playerData.points)
  };

  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8,
      available: isAvailabilitySchedule(playerData.availability_schedule) && 
                playerData.availability_schedule.selectedSlots.includes(`${dayIndex}-${timeIndex + 8}`),
    })),
  }));

  const handleScheduleChange = (slots: string[]) => {
    setSelectedTimeSlot(slots);
  };

  const handleSelectAllDay = (day: number) => {
    const daySlots = availableTimeSlots[day].slots
      .filter(slot => slot.available)
      .map(slot => `${day}-${slot.time}`);
    
    if (daySlots.length === 0) return;
    setSelectedTimeSlot([daySlots[0]]);
  };

  const handleOpenConfirmation = () => {
    if (selectedTimeSlot.length === 0) {
      toast({
        title: "Select Time Slot",
        description: "Please select a time slot for the challenge.",
        variant: "destructive",
      });
      return;
    }

    setIsConfirmationOpen(true);
  };

  const handleChallenge = async () => {
    try {
      setIsSubmitting(true);

      const [day, hour] = selectedTimeSlot[0].split('-').map(Number);
      const proposedDate = new Date();
      proposedDate.setDate(proposedDate.getDate() + ((7 + day - proposedDate.getDay()) % 7));
      proposedDate.setHours(hour, 0, 0, 0);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to send a challenge");
      }

      const { data: challenge, error } = await supabase
        .from('match_challenges')
        .insert({
          league_id: leagueId,
          challenger_id: session.session.user.id,
          challenged_id: playerId,
          proposed_time: proposedDate.toISOString(),
          location: playerData.primary_location || "To be determined",
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Challenge Sent!",
        description: `Challenge request sent to ${playerData.name}`,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [day, hour] = selectedTimeSlot[0]?.split('-').map(Number) || [];
  const proposedDate = new Date();
  if (day !== undefined && hour !== undefined) {
    proposedDate.setDate(proposedDate.getDate() + ((7 + day - proposedDate.getDay()) % 7));
    proposedDate.setHours(hour, 0, 0, 0);
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <PlayerProfile player={playerDataWithAchievements} />
        
        {playerData.primary_location && (
          <div className="mt-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Preferred Location: {playerData.primary_location}</span>
          </div>
        )}
        
        {playerData.favorite_venues && playerData.favorite_venues.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Favorite Venues:</p>
            <div className="flex flex-wrap gap-2">
              {playerData.favorite_venues.map((venue, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {venue}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <WeeklySchedule 
          availableTimeSlots={availableTimeSlots}
          selectedTimeSlots={selectedTimeSlot}
          onTimeSlotSelect={handleScheduleChange}
          onSelectAllDay={handleSelectAllDay}
          singleSelect={true}
        />
        <div className="mt-6">
          <Button 
            className="w-full"
            onClick={handleOpenConfirmation}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Challenge..." : "Send Challenge Request"}
          </Button>
        </div>
      </Card>

      <ChallengeConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleChallenge}
        challengeDetails={{
          playerName: playerData.name,
          leagueName: playerData.leagueName,
          location: playerData.primary_location || "To be determined",
          proposedTime: proposedDate.toISOString(),
          leagueId: playerData.leagueId,
        }}
      />
    </div>
  );
};

export default PlayerChallenge;