import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TournamentHeader } from "@/components/tournament-registration/TournamentHeader";
import { TournamentInfo } from "@/components/tournament-registration/TournamentInfo";
import { PositionSelector } from "@/components/tournament-registration/PositionSelector";
import { RegistrationButton } from "@/components/tournament-registration/RegistrationButton";

const TournamentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [primaryPosition, setPrimaryPosition] = useState<string>("");
  const [secondaryPosition, setSecondaryPosition] = useState<string>("");

  const { data: league, isLoading } = useQuery({
    queryKey: ['league', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: 'Failed to load league details'
    }
  });

  // Mock availability data - in a real app, this would come from the backend
  const availability = {
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
  };

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlots(slotId ? [slotId] : []);
  };

  const handleSelectAllDay = (day: number) => {
    const daySlots = availability.availableTimeSlots[day].slots
      .filter(slot => slot.available)
      .map(slot => `${day}-${slot.time}`);

    setSelectedTimeSlots(prev => {
      const isFullySelected = daySlots.every(slot => prev.includes(slot));
      if (isFullySelected) {
        return prev.filter(slot => !daySlots.includes(slot));
      }
      return [...new Set([...prev, ...daySlots])];
    });
  };

  const handleSubmit = async () => {
    if (!selectedTimeSlots.length || !primaryPosition) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to register for the league.",
          variant: "destructive",
        });
        return;
      }

      // First, join the league
      const { error: joinError } = await supabase
        .from('league_participants')
        .insert({
          league_id: id,
          user_id: user.id,
        });

      if (joinError) throw joinError;

      // Then, save player statistics with availability
      const { error: statsError } = await supabase
        .from('player_statistics')
        .insert({
          league_id: id,
          player_id: user.id,
          preferred_position: primaryPosition,
          availability_schedule: {
            timeSlots: selectedTimeSlots,
            secondaryPosition,
          },
        });

      if (statsError) throw statsError;

      toast({
        title: "Registration successful!",
        description: "You have been registered for the tournament.",
      });
      
      navigate(`/tournament/${id}`);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        Loading tournament details...
      </div>
    </div>;
  }

  if (!league) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        Tournament not found
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6">
          <Card className="bg-white/80 shadow-lg">
            <TournamentHeader name={league.name} />
            <CardContent className="grid gap-6">
              <TournamentInfo
                registrationDeadline={league.registration_deadline}
                startDate={league.start_date}
                endDate={league.end_date}
                matchFormat={league.match_format}
                rules={league.rules}
              />

              <PositionSelector
                primaryPosition={primaryPosition}
                setPrimaryPosition={setPrimaryPosition}
                secondaryPosition={secondaryPosition}
                setSecondaryPosition={setSecondaryPosition}
              />

              <WeeklySchedule
                availableTimeSlots={availability.availableTimeSlots}
                selectedTimeSlot={selectedTimeSlots[0]}
                onTimeSlotSelect={handleTimeSlotSelect}
                multiSelect={false}
              />

              <RegistrationButton onClick={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentRegistration;
