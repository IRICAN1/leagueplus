import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {duos.map((duo) => (
              <div
                key={duo.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDuo === duo.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedDuo(duo.id)}
              >
                <p className="font-medium">{duo.player2.username}</p>
                <p className="text-sm text-gray-600">
                  Wins: {duo.duo_statistics[0]?.wins || 0} - 
                  Losses: {duo.duo_statistics[0]?.losses || 0}
                </p>
              </div>
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

              <button
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => handleDuoSelect(selectedDuo)}
              >
                Select Duo & Continue
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};