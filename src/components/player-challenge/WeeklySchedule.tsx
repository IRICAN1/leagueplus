import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayHeader } from "./DayHeader";
import { TimeSlot } from "./TimeSlot";
import { format } from "date-fns";

interface WeeklyScheduleProps {
  availableTimeSlots: Array<{
    day: number;
    slots: Array<{
      time: number;
      available: boolean;
    }>;
  }>;
  selectedTimeSlot?: string | null;
  selectedTimeSlots?: string[];
  onTimeSlotSelect: ((slotId: string) => void) | ((slots: string[]) => void);
  onSelectAllDay?: (day: number) => void;
  playerAvailability?: string[];
  multiSelect?: boolean;
}

export const WeeklySchedule = ({
  availableTimeSlots,
  selectedTimeSlot,
  selectedTimeSlots = [],
  onTimeSlotSelect,
  onSelectAllDay,
  playerAvailability = [],
  multiSelect = false
}: WeeklyScheduleProps) => {
  const isPastDate = (day: number, time: number) => {
    const now = new Date();
    const slotDate = new Date();
    slotDate.setDate(slotDate.getDate() + (day - now.getDay()));
    slotDate.setHours(time, 0, 0, 0);
    return slotDate < now;
  };

  const handleTimeSlotClick = (slotId: string) => {
    if (multiSelect) {
      const updatedSlots = selectedTimeSlots.includes(slotId)
        ? selectedTimeSlots.filter(slot => slot !== slotId)
        : [...selectedTimeSlots, slotId];
      (onTimeSlotSelect as (slots: string[]) => void)(updatedSlots);
    } else {
      if (selectedTimeSlot === slotId) {
        (onTimeSlotSelect as (slotId: string) => void)(null as any);
      } else {
        (onTimeSlotSelect as (slotId: string) => void)(slotId);
      }
    }
  };

  const getSlotDateTime = (day: number, time: number) => {
    const now = new Date();
    const slotDate = new Date();
    slotDate.setDate(slotDate.getDate() + (day - now.getDay()));
    slotDate.setHours(time, 0, 0, 0);
    return slotDate;
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
                isFullySelected={false}
                onSelectAll={onSelectAllDay ? () => onSelectAllDay(day.day) : undefined}
              />
              <div className="space-y-0.5">
                {day.slots.map((slot) => {
                  const slotId = `${day.day}-${slot.time}`;
                  const isSelected = multiSelect 
                    ? selectedTimeSlots.includes(slotId)
                    : selectedTimeSlot === slotId;
                  const isPast = isPastDate(day.day, slot.time);
                  const isAvailable = slot.available && playerAvailability.includes(slotId);

                  return (
                    <TimeSlot
                      key={slotId}
                      time={slot.time}
                      isSelected={isSelected}
                      isAvailable={isAvailable}
                      isPast={isPast}
                      onClick={() => handleTimeSlotClick(slotId)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!multiSelect && selectedTimeSlot && (
          <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
            <h4 className="text-sm font-medium text-green-800">Selected Time:</h4>
            {(() => {
              const [day, time] = selectedTimeSlot.split('-').map(Number);
              const dateTime = getSlotDateTime(day, Number(time));
              return (
                <div className="text-sm text-green-700">
                  <p>Date: {format(dateTime, 'EEEE, MMMM d, yyyy')}</p>
                  <p>Time: {format(dateTime, 'h:mm a')} - {format(new Date(dateTime.getTime() + 3600000), 'h:mm a')}</p>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};