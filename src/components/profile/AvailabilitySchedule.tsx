import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WeeklySchedule } from "../player-challenge/WeeklySchedule";

interface AvailabilityScheduleProps {
  isEditing: boolean;
  formData: {
    availabilitySchedule?: any;
    weekdayPreference?: string;
  };
  onChange: (field: string, value: any) => void;
}

export const AvailabilitySchedule = ({
  isEditing,
  formData,
  onChange,
}: AvailabilityScheduleProps) => {
  // Initialize default time slots if not present
  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 12 }, (_, timeIndex) => ({
      time: timeIndex + 8, // Start from 8 AM
      available: true,
    })),
  }));

  const selectedTimeSlots = formData.availabilitySchedule?.selectedSlots || [];

  const handleTimeSlotSelect = (slots: string[]) => {
    onChange('availabilitySchedule', {
      ...formData.availabilitySchedule,
      selectedSlots: slots,
    });
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Weekly Schedule</Label>
        <div className="bg-white rounded-lg p-4">
          <WeeklySchedule
            availableTimeSlots={availableTimeSlots}
            selectedTimeSlots={selectedTimeSlots}
            onTimeSlotSelect={handleTimeSlotSelect}
            onSelectAllDay={handleSelectAllDay}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>General Preference</Label>
        <RadioGroup
          disabled={!isEditing}
          value={formData.weekdayPreference}
          onValueChange={(value) => onChange('weekdayPreference', value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekday" id="weekday" />
            <Label htmlFor="weekday">Prefer Weekdays</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekend" id="weekend" />
            <Label htmlFor="weekend">Prefer Weekends</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">No Preference</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};