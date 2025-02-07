
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TournamentHeader } from "@/components/tournament-registration/TournamentHeader";
import { TournamentInfo } from "@/components/tournament-registration/TournamentInfo";
import { RegistrationButton } from "@/components/tournament-registration/RegistrationButton";
import { RegistrationHandler } from "@/components/tournament-registration/RegistrationHandler";
import { AvailabilitySection } from "@/components/tournament-registration/AvailabilitySection";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { isAvailabilitySchedule } from "@/types/availability";
import { useDuoLeagueDetails } from "@/hooks/useDuoLeagueDetails";
import { useLeagueDetails } from "@/hooks/useLeagueDetails";
import { useUserDuos } from "@/hooks/useUserDuos";
import { LoadingState } from "@/components/tournament-registration/LoadingState";
import { DuoSelectionSection } from "@/components/tournament-registration/DuoSelectionSection";

const TournamentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [hasExistingSchedule, setHasExistingSchedule] = useState<boolean | null>(null);
  const [showRegistrationHandler, setShowRegistrationHandler] = useState(false);
  const [selectedDuo, setSelectedDuo] = useState<string | null>(null);

  const { data: duoLeague, isLoading: isDuoLeagueLoading } = useDuoLeagueDetails(id);
  const { data: league, isLoading: isLeagueLoading } = useLeagueDetails(id, !duoLeague);
  const { duos, isLoadingDuos } = useUserDuos(league?.is_doubles ?? false);

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
      const schedule = profile.availability_schedule;
      if (isAvailabilitySchedule(schedule)) {
        setSelectedTimeSlots(schedule.selectedSlots);
        setHasExistingSchedule(true);
      } else {
        setHasExistingSchedule(false);
      }
    } else {
      setHasExistingSchedule(false);
    }
  }, [profile]);

  const handleDuoSelect = (duoId: string) => {
    setSelectedDuo(duoId);
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

      if (league?.is_doubles) {
        if (!selectedDuo) {
          toast({
            title: "Duo selection required",
            description: "Please select a duo partner before registering.",
            variant: "destructive",
          });
          return;
        }
        setShowRegistrationHandler(true);
        return;
      }

      const { error: joinError } = await supabase
        .from('league_participants')
        .insert({
          league_id: id,
          user_id: user.id,
        });

      if (joinError) throw joinError;

      const { error: statsError } = await supabase
        .from('player_statistics')
        .insert({
          league_id: id,
          player_id: user.id,
          availability_schedule: {
            timeSlots: selectedTimeSlots,
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

  if (isDuoLeagueLoading || isLeagueLoading || isProfileLoading || hasExistingSchedule === null) {
    return <LoadingState />;
  }

  if (!league && !duoLeague) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <Alert variant="destructive">
            <AlertDescription>Tournament not found. Please check the URL and try again.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (duoLeague) {
    return <LoadingState />;
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

              {league?.is_doubles && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select Duo Partner</h3>
                    <DuoSelectionSection
                      isLoadingDuos={isLoadingDuos}
                      duos={duos}
                      selectedDuo={selectedDuo}
                      onDuoSelect={handleDuoSelect}
                    />
                  </div>
                </>
              )}

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
                    
                    <AvailabilitySection onTimeSlotSelect={setSelectedTimeSlots} />
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <RegistrationButton 
                onClick={handleSubmit} 
                disabled={league?.is_doubles && !selectedDuo}
              />
            </CardContent>
          </Card>
        </div>

        {showRegistrationHandler && league && (
          <RegistrationHandler
            leagueId={league.id}
            isDoubles={league.is_doubles}
            requirements={{
              skillLevel: `${league.skill_level_min}-${league.skill_level_max}`,
              ageCategory: league.age_min && league.age_max ? `${league.age_min}-${league.age_max}` : undefined,
              genderCategory: league.gender_category,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TournamentRegistration;
