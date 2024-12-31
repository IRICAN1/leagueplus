import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Award } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AvailabilitySchedule {
  selectedSlots: string[];
}

const isAvailabilitySchedule = (json: Json | null): json is { selectedSlots: string[] } => {
  if (!json || typeof json !== 'object') return false;
  return Array.isArray((json as { selectedSlots?: unknown }).selectedSlots);
};

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const { playerName, leagueId, fromTournament } = location.state || {};
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: playerData, isLoading } = useQuery({
    queryKey: ['player', playerId, leagueId],
    queryFn: async () => {
      if (!playerId || !leagueId) return null;

      // Fetch both profile and availability data
      const [profileResponse, statsResponse, availabilityResponse] = await Promise.all([
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
          .from('profiles')
          .select('availability_schedule')
          .eq('id', playerId)
          .single()
      ]);

      if (profileResponse.error) throw profileResponse.error;
      if (statsResponse.error && !statsResponse.error.message.includes('No rows found')) {
        throw statsResponse.error;
      }
      if (availabilityResponse.error) throw availabilityResponse.error;

      const stats = statsResponse.data || {
        rank: 0,
        wins: 0,
        losses: 0,
        points: 0
      };

      // Parse availability schedule
      const availabilitySchedule = isAvailabilitySchedule(availabilityResponse.data?.availability_schedule)
        ? availabilityResponse.data.availability_schedule.selectedSlots
        : [];

      return {
        ...profileResponse.data,
        name: playerName || profileResponse.data.username,
        rank: stats.rank,
        wins: stats.wins,
        losses: stats.losses,
        points: stats.points,
        achievements: stats.points > 100 ? [{ title: "High Scorer", icon: Award }] : [],
        leagueId,
        availabilitySchedule
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

  // Initialize default time slots
  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8, // Start from 8 AM
      available: true,
    })),
  }));

  const handleChallengeSubmit = () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Select a Time",
        description: "Please select an available time slot to challenge the player.",
        variant: "destructive",
      });
      return;
    }

    // Here you would implement the logic to submit the challenge
    toast({
      title: "Challenge Sent!",
      description: "Your challenge has been sent to the player.",
    });
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
          selectedLocation={locations[0].id}
          onLocationSelect={(id) => console.log("Selected location:", id)}
        />
        <WeeklySchedule 
          availableTimeSlots={availableTimeSlots}
          selectedTimeSlot={selectedTimeSlot}
          onTimeSlotSelect={setSelectedTimeSlot}
          playerAvailability={playerData.availabilitySchedule}
          multiSelect={false}
        />
        <div className="mt-6">
          <Button 
            className="w-full"
            onClick={handleChallengeSubmit}
            disabled={!selectedTimeSlot}
          >
            Send Challenge
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PlayerChallenge;