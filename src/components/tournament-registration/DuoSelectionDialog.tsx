import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Users } from "lucide-react";

interface DuoSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  duos: any[];
  onSelect: (duoId: string) => void;
  leagueRequirements?: {
    skillLevel?: string;
    ageCategory?: string;
    genderCategory?: string;
  };
}

export const DuoSelectionDialog = ({
  isOpen,
  onClose,
  duos,
  onSelect,
  leagueRequirements,
}: DuoSelectionDialogProps) => {
  const [selectedDuo, setSelectedDuo] = useState<string | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 16 }, (_, timeIndex) => ({
      time: timeIndex + 8,
      available: true,
    })),
  }));

  const handleTimeSlotSelect = async (slots: string[]) => {
    setSelectedTimeSlots(slots);
  };

  const handleSelectAllDay = (day: number) => {
    const daySlots = availableTimeSlots[day].slots.map(slot => `${day}-${slot.time}`);
    const currentSelected = new Set(selectedTimeSlots);
    const isDayFullySelected = daySlots.every(slot => currentSelected.has(slot));
    
    let newSelectedSlots;
    if (isDayFullySelected) {
      newSelectedSlots = selectedTimeSlots.filter(slot => !daySlots.includes(slot));
    } else {
      newSelectedSlots = [...new Set([...selectedTimeSlots, ...daySlots])];
    }
    
    handleTimeSlotSelect(newSelectedSlots);
  };

  const handleDuoSelect = async (duoId: string) => {
    try {
      if (selectedTimeSlots.length === 0) {
        toast.error("Please select your duo's availability schedule");
        return;
      }

      const { error: updateError } = await supabase
        .from('duo_partnerships')
        .update({
          availability_schedule: {
            selectedSlots: selectedTimeSlots,
          },
        })
        .eq('id', duoId);

      if (updateError) throw updateError;

      onSelect(duoId);
      onClose();
    } catch (error: any) {
      toast.error("Failed to update duo availability");
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Duo Partner & Availability</DialogTitle>
          <DialogDescription>
            Choose a duo partner and set your availability schedule for league matches
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {duos.map((duo) => (
              <Card
                key={duo.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedDuo === duo.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDuo(duo.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{duo.player2.username}</h3>
                      <Badge variant="secondary">
                        Win Rate: {
                          duo.duo_statistics[0]
                            ? Math.round(
                                (duo.duo_statistics[0].wins /
                                  (duo.duo_statistics[0].wins + duo.duo_statistics[0].losses)) *
                                  100
                              )
                            : 0
                        }%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Matches: {duo.duo_statistics[0]?.wins || 0} W - {duo.duo_statistics[0]?.losses || 0} L
                    </p>
                  </div>
                  {selectedDuo === duo.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {selectedDuo && (
            <div className="space-y-4">
              <WeeklySchedule
                availableTimeSlots={availableTimeSlots}
                selectedTimeSlots={selectedTimeSlots}
                onTimeSlotSelect={handleTimeSlotSelect}
                onSelectAllDay={handleSelectAllDay}
                isDuo={true}
              />

              <Button
                className="w-full"
                onClick={() => handleDuoSelect(selectedDuo)}
                disabled={selectedTimeSlots.length === 0}
              >
                <Users className="mr-2 h-4 w-4" />
                Complete Registration
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};