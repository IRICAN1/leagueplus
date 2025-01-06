import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { RegistrationForm } from "@/components/tournament-registration/RegistrationForm";
import { RegistrationHandler } from "@/components/tournament-registration/RegistrationHandler";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { isAvailabilitySchedule } from "@/types/availability";

const TournamentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [primaryPosition, setPrimaryPosition] = useState<string>("");
  const [secondaryPosition, setSecondaryPosition] = useState<string>("");
  const [hasExistingSchedule, setHasExistingSchedule] = useState<boolean | null>(null);
  const [showRegistrationHandler, setShowRegistrationHandler] = useState(false);

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

      // For doubles leagues, show the registration handler
      if (league?.is_doubles) {
        setShowRegistrationHandler(true);
        return;
      }

      // For individual leagues, proceed with direct registration
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
          <RegistrationForm
            league={league}
            primaryPosition={primaryPosition}
            setPrimaryPosition={setPrimaryPosition}
            secondaryPosition={secondaryPosition}
            setSecondaryPosition={setSecondaryPosition}
            hasExistingSchedule={hasExistingSchedule}
            onTimeSlotSelect={setSelectedTimeSlots}
            onSubmit={handleSubmit}
          />
        </div>

        {showRegistrationHandler && league && (
          <RegistrationHandler
            leagueId={league.id}
            isDoubles={league.is_doubles}
            requirements={{
              skillLevel: `${league.skill_level_min}-${league.skill_level_max}`,
              ageMin: league.age_min,
              ageMax: league.age_max,
              genderCategory: league.gender_category,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TournamentRegistration;