import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
    setSelectedTimeSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      }
      return [...prev, slotId];
    });
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Registration Open
                  </Badge>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    {league.name}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Important Dates
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>Registration Deadline: {new Date(league.registration_deadline).toLocaleDateString()}</p>
                    <p>Start Date: {new Date(league.start_date).toLocaleDateString()}</p>
                    <p>End Date: {new Date(league.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-purple-600" />
                    Tournament Format
                  </h3>
                  <p className="text-sm">{league.match_format}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-purple-600" />
                    Rules
                  </h3>
                  <div className="text-sm space-y-1">
                    {league.rules ? (
                      <p>{league.rules}</p>
                    ) : (
                      <p>No specific rules provided</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-semibold">Primary Position</label>
                  <Select value={primaryPosition} onValueChange={setPrimaryPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singles">Singles</SelectItem>
                      <SelectItem value="doubles">Doubles</SelectItem>
                      <SelectItem value="mixed">Mixed Doubles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold">Secondary Position (Optional)</label>
                  <Select value={secondaryPosition} onValueChange={setSecondaryPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select secondary position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singles">Singles</SelectItem>
                      <SelectItem value="doubles">Doubles</SelectItem>
                      <SelectItem value="mixed">Mixed Doubles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <WeeklySchedule
                availableTimeSlots={availability.availableTimeSlots}
                selectedTimeSlots={selectedTimeSlots}
                onTimeSlotSelect={handleTimeSlotSelect}
                onSelectAllDay={handleSelectAllDay}
              />

              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit}
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  size="lg"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Complete Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentRegistration;