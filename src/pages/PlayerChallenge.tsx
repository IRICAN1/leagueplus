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

  // Initialize default time slots
  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8, // Start from 8 AM
      available: true,
    })),
  }));

  const selectedTimeSlots = isAvailabilitySchedule(playerData.availability_schedule) 
    ? playerData.availability_schedule.selectedSlots 
    : [];

  const handleScheduleChange = async (slots: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          availability_schedule: { selectedSlots: slots }
        })
        .eq('id', playerData.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating availability schedule:', error);
    }
  };

  const handleSelectAllDay = async (day: number) => {
    const daySlots = availableTimeSlots[day].slots.map(slot => `${day}-${slot.time}`);
    const currentSelected = new Set(selectedTimeSlots);
    const isDayFullySelected = daySlots.every(slot => currentSelected.has(slot));
    
    let newSelectedSlots;
    if (isDayFullySelected) {
      newSelectedSlots = selectedTimeSlots.filter(slot => !daySlots.includes(slot));
    } else {
      newSelectedSlots = [...new Set([...selectedTimeSlots, ...daySlots])];
    }
    
    await handleScheduleChange(newSelectedSlots);
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
          selectedTimeSlots={selectedTimeSlots}
          onTimeSlotSelect={handleScheduleChange}
          onSelectAllDay={handleSelectAllDay}
        />
      </Card>
    </div>
  );
};

export default PlayerChallenge;
