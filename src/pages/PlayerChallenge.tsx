import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Trophy, MapPin, Calendar as CalendarIcon, Award, User, Sword, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  // Mock player data - in a real app, this would come from an API
  const player = {
    name: "John Doe",
    rank: 1,
    wins: 15,
    losses: 3,
    points: 1500,
    preferredLocations: [
      { id: "1", name: "Tennis Club Paris", distance: "2km" },
      { id: "2", name: "Roland Garros", distance: "5km" },
      { id: "3", name: "Tennis Academy", distance: "3km" },
    ],
    achievements: [
      { title: "Tournament Winner", icon: Trophy },
      { title: "Most Improved", icon: Award },
    ],
    availability: {
      workingHours: {
        start: 8,
        end: 20,
      },
      disabledDays: [0, 6], // Weekends disabled
      availableTimeSlots: Array.from({ length: 7 }, (_, dayIndex) => ({
        day: dayIndex,
        slots: Array.from({ length: 12 }, (_, hourIndex) => ({
          time: 8 + hourIndex,
          available: Math.random() > 0.3, // Randomly generate availability for demo
        })),
      })),
    },
  };

  const handleChallenge = () => {
    if (!selectedTimeSlot || !selectedLocation) {
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
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const getTimeSlotClass = (available: boolean, isSelected: boolean) => {
    return cn(
      "p-2 rounded-md text-sm transition-all duration-200 flex flex-col items-center justify-center h-16",
      {
        "bg-blue-50 hover:bg-blue-100 cursor-pointer border-2 border-transparent hover:border-blue-300": available && !isSelected,
        "bg-gray-100 cursor-not-allowed text-gray-400": !available,
        "bg-blue-200 border-2 border-blue-500": isSelected,
      }
    );
  };

  const getTimeBlockLabel = (hour: number) => {
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Player Profile Card */}
          <Card className="bg-white/80 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Player Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">{player.name}</h2>
                  <Badge variant="secondary" className="text-blue-700">
                    Rank #{player.rank}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{player.wins}</div>
                    <div className="text-sm text-gray-600">Wins</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{player.losses}</div>
                    <div className="text-sm text-gray-600">Losses</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{player.points}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {player.achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 border-blue-200 text-blue-600 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {achievement.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Weekly Schedule Card */}
          <Card className="md:col-span-2 bg-white/80 shadow-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Select Time Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {player.availability.availableTimeSlots.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="text-center font-semibold text-gray-700 pb-2 border-b">
                      {getDayName(day.day)}
                    </div>
                    <div className="space-y-2">
                      {day.slots.map((slot) => {
                        const timeString = `${format(new Date().setHours(slot.time), 'ha')}`;
                        const slotId = `${day.day}-${slot.time}`;
                        const isSelected = selectedTimeSlot === slotId;

                        return (
                          <div
                            key={slotId}
                            className={getTimeSlotClass(slot.available, isSelected)}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedTimeSlot(slotId);
                              }
                            }}
                          >
                            <span className="font-medium">{timeString}</span>
                            <span className="text-xs text-gray-500">
                              {getTimeBlockLabel(slot.time)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locations Card */}
          <Card className="md:col-span-2 bg-white/80 shadow-lg animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Select Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedLocation}
                onValueChange={setSelectedLocation}
                className="grid gap-4 md:grid-cols-3"
              >
                {player.preferredLocations.map((location) => (
                  <label
                    key={location.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                      selectedLocation === location.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={location.id} id={location.id} />
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.distance}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Challenge Button with Sword Animation */}
          <div className="md:col-span-2 flex justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button
              onClick={handleChallenge}
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
