import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Trophy, MapPin, Calendar as CalendarIcon, Award, User, Sword } from "lucide-react";
import { cn } from "@/lib/utils";

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
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
      // Mock available time slots
      disabledDays: [0, 6], // Weekends disabled
      disabledHours: [0, 1, 2, 3, 4, 5, 6, 7, 22, 23], // Early morning and late night disabled
    },
  };

  const handleChallenge = () => {
    if (!selectedDate || !selectedLocation) {
      toast({
        title: "Please select both date and location",
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
          {/* Calendar Card */}
          <Card className="bg-white/80 shadow-lg animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  return (
                    date < new Date() ||
                    player.availability.disabledDays.includes(date.getDay())
                  );
                }}
                className="animate-fade-in"
              />
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
