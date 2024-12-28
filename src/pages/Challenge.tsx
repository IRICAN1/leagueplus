import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Challenge = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // Mock data for demonstration
  const player = {
    id: playerId,
    name: "John Doe",
    availableRegions: [
      { id: "paris", name: "Paris Region" },
      { id: "lyon", name: "Lyon Region" },
      { id: "marseille", name: "Marseille Region" },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedRegion) {
      toast.error("Please select both a date and a region");
      return;
    }

    // Here you would typically send the challenge request to your backend
    toast.success("Challenge request sent successfully!");
    navigate(`/tournament/${playerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="bg-white/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Challenge {player.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Select Date</h3>
                <div className="flex justify-center bg-white rounded-lg p-4 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Select Region</h3>
                <RadioGroup
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                  className="grid gap-4"
                >
                  {player.availableRegions.map((region) => (
                    <div key={region.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={region.id} id={region.id} />
                      <Label htmlFor={region.id}>{region.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full">
                  Send Challenge Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Challenge;