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

const TournamentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [primaryPosition, setPrimaryPosition] = useState<string>("");
  const [secondaryPosition, setSecondaryPosition] = useState<string>("");

  // Mock tournament data - replace with actual data fetching
  const tournament = {
    title: "Tennis Tournament 2024",
    format: "Single Elimination",
    rules: [
      "Matches are best of 3 sets",
      "Standard tennis scoring rules apply",
      "Players must arrive 15 minutes before match time",
    ],
    dates: {
      registration: "January 15, 2024",
      start: "February 1, 2024",
      end: "February 15, 2024",
    },
    positions: [
      { id: "singles", label: "Singles" },
      { id: "doubles", label: "Doubles" },
      { id: "mixed", label: "Mixed Doubles" },
    ],
  };

  // Mock availability data - replace with actual data
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

  const handleSubmit = async () => {
    if (!selectedTimeSlot || !primaryPosition) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add registration logic here
      toast({
        title: "Registration successful!",
        description: "You have been registered for the tournament.",
      });
      navigate(`/tournament/${id}`);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6">
          {/* Tournament Information */}
          <Card className="bg-white/80 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Registration Open
                  </Badge>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    {tournament.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Tournament Details */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Important Dates
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>Registration: {tournament.dates.registration}</p>
                    <p>Start Date: {tournament.dates.start}</p>
                    <p>End Date: {tournament.dates.end}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-purple-600" />
                    Tournament Format
                  </h3>
                  <p className="text-sm">{tournament.format}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4 text-purple-600" />
                    Rules
                  </h3>
                  <ul className="text-sm space-y-1">
                    {tournament.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Position Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-semibold">Primary Position</label>
                  <Select value={primaryPosition} onValueChange={setPrimaryPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary position" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournament.positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.label}
                        </SelectItem>
                      ))}
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
                      {tournament.positions.map((position) => (
                        <SelectItem key={position.id} value={position.id}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time Slot Selection */}
              <WeeklySchedule
                availableTimeSlots={availability.availableTimeSlots}
                selectedTimeSlot={selectedTimeSlot}
                onTimeSlotSelect={setSelectedTimeSlot}
              />

              {/* Submit Button */}
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