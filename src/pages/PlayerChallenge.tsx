import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sword } from "lucide-react";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";
import { supabase } from "@/integrations/supabase/client";
import { transformProfileToPlayerData, transformLocationsToSelectableLocations } from "@/utils/playerTransforms";
import type { PlayerData } from "@/types/player";

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [playerAvailability, setPlayerAvailability] = useState<string[]>([]);
  const [myAvailability, setMyAvailability] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        if (!playerId) {
          setError("No player ID provided");
          return;
        }

        // Fetch challenged player's profile and availability
        const { data: playerProfile, error: playerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', playerId)
          .maybeSingle();

        if (playerError) throw playerError;
        
        if (!playerProfile) {
          setError("Player not found");
          toast({
            title: "Player not found",
            description: "The requested player profile could not be found.",
            variant: "destructive",
          });
          return;
        }

        setPlayerData(playerProfile);

        // Extract player availability
        let playerSlots: string[] = [];
        if (playerProfile?.availability_schedule && 
            typeof playerProfile.availability_schedule === 'object' && 
            !Array.isArray(playerProfile.availability_schedule)) {
          const scheduleData = playerProfile.availability_schedule as Record<string, unknown>;
          if ('selectedSlots' in scheduleData && Array.isArray(scheduleData.selectedSlots)) {
            playerSlots = scheduleData.selectedSlots.map(slot => String(slot));
          }
        }
        setPlayerAvailability(playerSlots);

        // Fetch current user's availability
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setError("Please log in to challenge players");
          return;
        }

        const { data: myProfile, error: myError } = await supabase
          .from('profiles')
          .select('availability_schedule')
          .eq('id', session.user.id)
          .maybeSingle();

        if (myError) throw myError;

        // Extract my availability
        let mySlots: string[] = [];
        if (myProfile?.availability_schedule && 
            typeof myProfile.availability_schedule === 'object' && 
            !Array.isArray(myProfile.availability_schedule)) {
          const scheduleData = myProfile.availability_schedule as Record<string, unknown>;
          if ('selectedSlots' in scheduleData && Array.isArray(scheduleData.selectedSlots)) {
            mySlots = scheduleData.selectedSlots.map(slot => String(slot));
          }
        }
        setMyAvailability(mySlots);

      } catch (error: any) {
        toast({
          title: "Error fetching availability",
          description: error.message,
          variant: "destructive",
        });
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailabilities();
  }, [playerId, toast]);

  // Initialize available time slots
  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8, // Start from 8 AM
      available: true,
      isMatchingSlot: false
    })),
  }));

  // Update slots to show matching availability
  availableTimeSlots.forEach(day => {
    day.slots.forEach(slot => {
      const slotId = `${day.day}-${slot.time}`;
      slot.isMatchingSlot = playerAvailability.includes(slotId) && myAvailability.includes(slotId);
    });
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <p className="text-lg text-red-600">{error || "Player not found"}</p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <PlayerProfile player={transformProfileToPlayerData(playerData)} />
          
          <WeeklySchedule
            availableTimeSlots={availableTimeSlots}
            selectedTimeSlots={selectedTimeSlots}
            onTimeSlotSelect={setSelectedTimeSlots}
            onSelectAllDay={() => {}}
          />

          <LocationSelector
            locations={transformLocationsToSelectableLocations(playerData.preferred_regions || [])}
            selectedLocation={selectedLocation}
            onLocationSelect={setSelectedLocation}
          />

          <div className="md:col-span-2 flex justify-center animate-fade-in">
            <Button
              onClick={() => {
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
              }}
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