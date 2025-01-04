import { useState } from "react";
import { WeeklySchedule } from "./WeeklySchedule";
import { WeekSelector } from "./WeekSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Swords } from "lucide-react";

interface ChallengeFormProps {
  playerData: any;
  onOpenConfirmation: () => void;
  onTimeSlotSelect: (slots: string[]) => void;
  selectedTimeSlot: string[];
}

export const ChallengeForm = ({
  playerData,
  onOpenConfirmation,
  onTimeSlotSelect,
  selectedTimeSlot,
}: ChallengeFormProps) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const { toast } = useToast();

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    // Reset time slot selection when week changes
    onTimeSlotSelect([]);
  };

  const handleSelectAllDay = (day: number) => {
    const availableTimeSlots = getAvailableTimeSlots();
    const daySlots = availableTimeSlots[day].slots
      .filter(slot => slot.available)
      .map(slot => `${day}-${slot.time}`);
    
    if (daySlots.length === 0) return;
    onTimeSlotSelect([daySlots[0]]);
  };

  const getAvailableTimeSlots = () => {
    return Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex,
      slots: Array.from({ length: 12 }, (_, timeIndex) => ({
        time: timeIndex + 8,
        available: playerData.availability_schedule && 
                  playerData.availability_schedule.selectedSlots &&
                  playerData.availability_schedule.selectedSlots.includes(`${dayIndex}-${timeIndex + 8}`),
      })),
    }));
  };

  const handleSubmit = () => {
    if (selectedTimeSlot.length === 0) {
      toast({
        title: "Select Time Slot",
        description: "Please select a time slot for the challenge.",
        variant: "destructive",
      });
      return;
    }
    onOpenConfirmation();
  };

  return (
    <div className="space-y-6">
      <WeekSelector
        selectedWeek={selectedWeek}
        onWeekChange={handleWeekChange}
      />
      <WeeklySchedule 
        availableTimeSlots={getAvailableTimeSlots()}
        selectedTimeSlots={selectedTimeSlot}
        onTimeSlotSelect={onTimeSlotSelect}
        onSelectAllDay={handleSelectAllDay}
        singleSelect={true}
        selectedWeek={selectedWeek}
      />
      <Button 
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        onClick={handleSubmit}
      >
        <Swords className="h-5 w-5 mr-2 animate-cross-swords" />
        Send Challenge Request
      </Button>
    </div>
  );
};