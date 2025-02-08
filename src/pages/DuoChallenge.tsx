
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { LocationSelector } from "@/components/player-challenge/LocationSelector";
import { ChallengeConfirmationDialog } from "@/components/player-challenge/ChallengeConfirmationDialog";

const DuoChallenge = () => {
  const { partnershipId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock locations for now - these should come from your backend
  const locations = [
    { id: "loc1", name: "Tennis Court A", distance: "2.5 miles" },
    { id: "loc2", name: "Tennis Court B", distance: "3.1 miles" },
    { id: "loc3", name: "Tennis Court C", distance: "4.2 miles" },
  ];

  // Mock available time slots - this should come from your backend
  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8, // 8 AM to 8 PM
      available: true,
    })),
  }));

  const handleTimeSlotSelect = (slots: string[]) => {
    setSelectedTimeSlots(slots);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleSelectAllDay = (day: number) => {
    const daySlots = availableTimeSlots[day].slots.map((slot) => `${day}-${slot.time}`);
    setSelectedTimeSlots((prev) => [...prev, ...daySlots]);
  };

  const getProposedTime = (timeSlot: string) => {
    if (!timeSlot) return new Date().toISOString();
    const [day, hour] = timeSlot.split('-').map(Number);
    const proposedDate = new Date();
    proposedDate.setDate(proposedDate.getDate() + ((7 + day - proposedDate.getDay()) % 7));
    proposedDate.setHours(hour, 0, 0, 0);
    return proposedDate.toISOString();
  };

  const handleSubmit = async () => {
    if (!selectedTimeSlots.length || !selectedLocation || !user || !partnershipId) {
      toast({
        title: "Error",
        description: "Please select both a time and location for the challenge",
        variant: "destructive",
      });
      return;
    }

    // Check if we have the league ID from location state
    if (!location.state?.leagueId) {
      toast({
        title: "Error",
        description: "League information is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      // First get the user's partnership for this league
      const { data: partnerships, error: partnershipError } = await supabase
        .from('duo_partnerships')
        .select('id')
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
        .single();

      if (partnershipError || !partnerships) {
        throw new Error('Could not find your partnership');
      }

      const { error } = await supabase
        .from('duo_match_challenges')
        .insert({
          challenger_partnership_id: partnerships.id,
          challenged_partnership_id: partnershipId,
          league_id: location.state.leagueId,
          location: selectedLocation,
          proposed_time: getProposedTime(selectedTimeSlots[0]),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Challenge Sent!",
        description: "Your challenge has been sent successfully.",
      });

      navigate('/my-matches');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send challenge",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Challenge Partnership</h1>
      
      <div className="grid gap-6">
        <WeeklySchedule
          availableTimeSlots={availableTimeSlots}
          selectedTimeSlots={selectedTimeSlots}
          onTimeSlotSelect={handleTimeSlotSelect}
          onSelectAllDay={handleSelectAllDay}
          singleSelect={true}
          isDuo={true}
        />
        
        <LocationSelector
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />

        <Button
          onClick={() => setShowConfirmation(true)}
          disabled={!selectedTimeSlots.length || !selectedLocation}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Send Challenge
        </Button>
      </div>

      <ChallengeConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleSubmit}
        challengeDetails={{
          playerName: location.state?.playerName || "Partnership",
          leagueName: location.state?.leagueName || "League",
          location: locations.find(loc => loc.id === selectedLocation)?.name || "",
          proposedTime: getProposedTime(selectedTimeSlots[0]),
          leagueId: location.state?.leagueId,
          playerId: partnershipId || ""
        }}
      />
    </div>
  );
};

export default DuoChallenge;

