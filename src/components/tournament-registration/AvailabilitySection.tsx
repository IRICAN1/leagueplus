import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState } from "react";

interface AvailabilitySectionProps {
  onTimeSlotSelect: (slots: string[]) => void;
}

export const AvailabilitySection = ({ onTimeSlotSelect }: AvailabilitySectionProps) => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8,
      available: true,
    })),
  }));

  const handleTimeSlotSelect = (slots: string[]) => {
    setSelectedTimeSlots(slots);
    onTimeSlotSelect(slots);
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

  return (
    <div className="space-y-4">
      <WeeklySchedule
        availableTimeSlots={availableTimeSlots}
        selectedTimeSlots={selectedTimeSlots}
        onTimeSlotSelect={handleTimeSlotSelect}
        onSelectAllDay={handleSelectAllDay}
      />
    </div>
  );
};