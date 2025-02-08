
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
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
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock locations for now - these should come from your backend
  const locations = [
    { id: "loc1", name: "Tennis Court A", distance: "2.5 miles" },
    { id: "loc2", name: "Tennis Court B", distance: "3.1 miles" },
    { id: "loc3", name: "Tennis Court C", distance: "4.2 miles" },
  ];

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleSubmit = async () => {
    if (!selectedTime || !selectedLocation || !user || !partnershipId || !location.state?.leagueId) {
      toast({
        title: "Error",
        description: "Please select both a time and location for the challenge",
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
          proposed_time: selectedTime.toISOString(),
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
        <WeeklySchedule onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
        
        <LocationSelector
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
        />

        <Button
          onClick={() => setShowConfirmation(true)}
          disabled={!selectedTime || !selectedLocation}
          className="w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Send Challenge
        </Button>
      </div>

      <ChallengeConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={handleSubmit}
        challengedName={location.state?.playerName || "Partnership"}
        proposedTime={selectedTime}
        location={locations.find(loc => loc.id === selectedLocation)?.name || ""}
      />
    </div>
  );
};

export default DuoChallenge;
