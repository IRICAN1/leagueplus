import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sword, Trophy, Award } from "lucide-react";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  // Mock player data - in a real app, this would come from an API
  const player = {
    name: "John Doe",
    rank: 1,
    wins: 15,
    losses: 3,
    points: 1500,
    preferredLocations: [
      { id: "1", name: "Tennis Club Paris", distance: "2km" },
      { id: "2", name: "Roland Garros", distance: "5km" },
      { id: "3", name: "Tennis Academy", distance: "3km" },
    ],
    achievements: [
      { title: "Tournament Winner", icon: Trophy },
      { title: "Most Improved", icon: Award },
    ],
    availability: {
      workingHours: {
        start: 8,
        end: 24,
      },
      disabledDays: [0, 6],
      availableTimeSlots: Array.from({ length: 7 }, (_, dayIndex) => ({
        day: dayIndex,
        slots: Array.from({ length: 16 }, (_, hourIndex) => ({
          time: 8 + hourIndex,
          available: Math.random() > 0.3,
        })),
      })),
    },
  };

  const handleChallenge = () => {
    if (selectedTimeSlots.length === 0 || !selectedLocation) {
      toast({
        title: "Please select both time and location",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Challenge sent!",
      description: "Your challenge request has been sent successfully.",
    });

    setTimeout(() => navigate("/tournament/1"), 2000);
  };

  const handleSelectAllDay = (day: number) => {
    const daySlots = player.availability.availableTimeSlots[day].slots;
    const dayTimeSlots = daySlots
      .filter(slot => slot.available)
      .map(slot => `${day}-${slot.time}`);
    
    const allSelected = dayTimeSlots.every(slot => selectedTimeSlots.includes(slot));
    
    if (allSelected) {
      setSelectedTimeSlots(prev => prev.filter(slot => !dayTimeSlots.includes(slot)));
    } else {
      setSelectedTimeSlots(prev => [...new Set([...prev, ...dayTimeSlots])]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <PlayerProfile player={player} />
          
          <WeeklySchedule
            availableTimeSlots={player.availability.availableTimeSlots}
            selectedTimeSlots={selectedTimeSlots}
            onTimeSlotSelect={setSelectedTimeSlots}
            onSelectAllDay={handleSelectAllDay}
          />

          <LocationSelector
            locations={player.preferredLocations}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />

          <div className="md:col-span-2 flex justify-center animate-fade-in">
            <Button
              onClick={handleChallenge}
              className="group relative w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 px-8"
              size="lg"
            >
              <div className="relative flex items-center justify-center gap-2">
                <Sword className="absolute left-0 transform -translate-x-2 group-hover:-translate-x-4 group-hover:-rotate-45 transition-all duration-300" />
                <span className="mx-8">Send Challenge Request</span>
                <Sword className="absolute right-0 transform translate-x-2 group-hover:translate-x-4 group-hover:rotate-45 transition-all duration-300" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerChallenge;