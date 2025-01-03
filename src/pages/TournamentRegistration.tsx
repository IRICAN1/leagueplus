import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TournamentHeader } from "@/components/tournament-registration/TournamentHeader";
import { TournamentInfo } from "@/components/tournament-registration/TournamentInfo";
import { PositionSelector } from "@/components/tournament-registration/PositionSelector";
import { RegistrationButton } from "@/components/tournament-registration/RegistrationButton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { isAvailabilitySchedule } from "@/types/availability";

const TournamentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [primaryPosition, setPrimaryPosition] = useState<string>("");
  const [secondaryPosition, setSecondaryPosition] = useState<string>("");
  const [hasExistingSchedule, setHasExistingSchedule] = useState<boolean | null>(null);

  // Query for league data
  const { data: league, isLoading: isLeagueLoading } = useQuery({
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

  // Query for user profile and availability
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile?.availability_schedule) {
      if (isAvailabilitySchedule(profile.availability_schedule)) {
        setSelectedTimeSlots(profile.availability_schedule.selectedSlots);
        setHasExistingSchedule(true);
      } else {
        setHasExistingSchedule(false);
      }
    } else {
      setHasExistingSchedule(false);
    }
  }, [profile]);

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

  const handleTimeSlotSelect = (newSelectedTimeSlots: string[]) => {
    setSelectedTimeSlots(newSelectedTimeSlots);
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

      if (!hasExistingSchedule && selectedTimeSlots.length === 0) {
        toast({
          title: "Time slots required",
          description: "Please select your available time slots before registering.",
          variant: "destructive",
        });
        return;
      }

      if (!primaryPosition) {
        toast({
          title: "Position required",
          description: "Please select your preferred position.",
          variant: "destructive",
        });
        return;
      }

      // First, update the user's profile with the time slots if they don't have any
      if (!hasExistingSchedule) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            availability_schedule: {
              selectedSlots: selectedTimeSlots,
            },
          })
          .eq('id', user.id);

        if (profileError) throw profileError;
      }

      // Join the league
      const { error: joinError } = await supabase
        .from('league_participants')
        .insert({
          league_id: id,
          user_id: user.id,
        });

      if (joinError) throw joinError;

      // Save player statistics
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
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLeagueLoading || isProfileLoading || hasExistingSchedule === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <Alert variant="destructive">
            <AlertDescription>Tournament not found</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6">
          <Card className="bg-white/80 shadow-lg">
            <TournamentHeader name={league?.name || ''} />
            <CardContent className="grid gap-6">
              <TournamentInfo
                registrationDeadline={league.registration_deadline}
                startDate={league.start_date}
                endDate={league.end_date}
                matchFormat={league.match_format}
                rules={league.rules}
              />

              <Separator className="my-4" />

              <PositionSelector
                primaryPosition={primaryPosition}
                setPrimaryPosition={setPrimaryPosition}
                secondaryPosition={secondaryPosition}
                setSecondaryPosition={setSecondaryPosition}
              />

              {!hasExistingSchedule && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <InfoIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Please configure your availability schedule below
                      </span>
                    </div>
                    
                    <WeeklySchedule
                      availableTimeSlots={availability.availableTimeSlots}
                      selectedTimeSlots={selectedTimeSlots}
                      onTimeSlotSelect={handleTimeSlotSelect}
                      onSelectAllDay={handleSelectAllDay}
                    />
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <RegistrationButton onClick={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentRegistration;