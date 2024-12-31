import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AvailabilitySchedule {
  selectedSlots: string[];
}

const isAvailabilitySchedule = (json: any): json is { selectedSlots: string[] } => {
  if (!json || typeof json !== 'object') return false;
  return Array.isArray((json as { selectedSlots?: unknown }).selectedSlots);
};

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const { playerName, leagueId, fromTournament } = location.state || {};
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: playerData, isLoading } = useQuery({
    queryKey: ['player', playerId, leagueId],
    queryFn: async () => {
      if (!playerId || !leagueId) return null;

      const [profileResponse, statsResponse] = await Promise.all([
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
          .single()
      ]);

      if (profileResponse.error) throw profileResponse.error;
      if (statsResponse.error && !statsResponse.error.message.includes('No rows found')) {
        throw statsResponse.error;
      }

      const stats = statsResponse.data || {
        rank: 0,
        wins: 0,
        losses: 0,
        points: 0
      };

      return {
        ...profileResponse.data,
        name: playerName || profileResponse.data.username,
        rank: stats.rank,
        wins: stats.wins,
        losses: stats.losses,
        points: stats.points,
        achievements: stats.points > 100 ? [{ title: "High Scorer", icon: Award }] : [],
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

  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8, // Start from 8 AM
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
    
    // In single select mode, just select the first available slot of the day
    setSelectedTimeSlot([daySlots[0]]);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleChallenge = async () => {
    if (selectedTimeSlot.length === 0) {
      toast({
        title: "Select Time Slot",
        description: "Please select a time slot for the challenge.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLocation) {
      toast({
        title: "Select Location",
        description: "Please select a location for the challenge.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Parse the selected time slot (format: "day-hour")
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
          location: selectedLocation,
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

  const locations = [
    { id: "1", name: "Local Court", distance: "2 miles" },
    { id: "2", name: "Sports Center", distance: "5 miles" },
    { id: "3", name: "City Stadium", distance: "8 miles" }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <PlayerProfile player={playerData} />
        <LocationSelector 
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />
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
            onClick={handleChallenge}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Challenge..." : "Send Challenge Request"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlayerChallenge;