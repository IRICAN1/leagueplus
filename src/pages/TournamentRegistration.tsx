import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TournamentRegistration = () => {
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] = useState(
    Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex,
      slots: Array.from({ length: 12 }, (_, timeIndex) => ({
        time: timeIndex + 8, // Start from 8 AM
        available: true,
        isMatchingSlot: true
      })),
    }))
  );

  const handleChallenge = async () => {
    if (selectedTimeSlots.length === 0 || !selectedLocation) {
      toast({
        title: "Please select both time and location",
        variant: "destructive",
      });
      return;
    }

    // Verify if selected slots are available for both players
    const invalidSlots = selectedTimeSlots.filter(slot => 
      !availableTimeSlots.some(day => 
        day.slots.some(s => s.isMatchingSlot && `${day.day}-${s.time}` === slot)
      )
    );

    if (invalidSlots.length > 0) {
      toast({
        title: "Invalid time slots selected",
        description: "Please select time slots that are available for both players",
        variant: "destructive",
      });
      return;
    }

    // Proceed with the challenge logic
    toast({
      title: "Challenge sent!",
      description: "Your challenge request has been sent successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <WeeklySchedule
          availableTimeSlots={availableTimeSlots}
          selectedTimeSlots={selectedTimeSlots}
          onTimeSlotSelect={setSelectedTimeSlots}
          onSelectAllDay={() => {}}
        />

        <LocationSelector
          locations={[]}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />

        <div className="flex justify-center animate-fade-in">
          <Button
            onClick={handleChallenge}
            className="group relative w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 px-8"
            size="lg"
          >
            Send Challenge Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TournamentRegistration;