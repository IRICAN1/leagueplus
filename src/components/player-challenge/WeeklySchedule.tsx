import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayHeader } from "./DayHeader";
import { TimeSlot } from "./TimeSlot";

interface WeeklyScheduleProps {
  availableTimeSlots: Array<{
    day: number;
    slots: Array<{
      time: number;
      available: boolean;
    }>;
  }>;
  selectedTimeSlots: string[];
  onTimeSlotSelect: (value: string[]) => void;
  onSelectAllDay: (day: number) => void;
  singleSelect?: boolean;
}

export const WeeklySchedule = ({
  availableTimeSlots,
  selectedTimeSlots,
  onTimeSlotSelect,
  onSelectAllDay,
  singleSelect = false,
}: WeeklyScheduleProps) => {
  const isDayFullySelected = (day: number) => {
    return availableTimeSlots[day].slots.every((slot) => {
      const slotId = `${day}-${slot.time}`;
      return selectedTimeSlots.includes(slotId);
    });
  };

  const handleTimeSlotClick = (slotId: string) => {
    let newSelectedTimeSlots: string[];
    
    if (singleSelect) {
      // In single select mode, only keep the new selection
      newSelectedTimeSlots = [slotId];
    } else {
      // In multi-select mode, toggle the selection
      newSelectedTimeSlots = selectedTimeSlots.includes(slotId)
        ? selectedTimeSlots.filter(id => id !== slotId)
        : [...selectedTimeSlots, slotId];
    }
    
    onTimeSlotSelect(newSelectedTimeSlots);
  };

  return (
    <Card className="md:col-span-2 bg-white/80 shadow-lg animate-fade-in">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-1 text-base">
          <Clock className="h-4 w-4 text-green-500" />
          Select Time Slot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {availableTimeSlots.map((day) => (
            <div key={day.day} className="space-y-0.5">
              <DayHeader
                day={day.day}
                isFullySelected={isDayFullySelected(day.day)}
                onSelectAll={() => onSelectAllDay(day.day)}
              />
              <div className="space-y-0.5">
                {day.slots.map((slot) => {
                  const slotId = `${day.day}-${slot.time}`;
                  const isSelected = selectedTimeSlots.includes(slotId);

                  return (
                    <TimeSlot
                      key={slotId}
                      time={slot.time}
                      isSelected={isSelected}
                      isAvailable={slot.available}
                      onClick={() => handleTimeSlotClick(slotId)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
