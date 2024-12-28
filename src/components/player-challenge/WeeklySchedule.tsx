import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeeklyScheduleProps {
  availableTimeSlots: Array<{
    day: number;
    slots: Array<{
      time: number;
      available: boolean;
    }>;
  }>;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (slotId: string) => void;
}

export const WeeklySchedule = ({
  availableTimeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
}: WeeklyScheduleProps) => {
  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  const getTimeSlotClass = (available: boolean, isSelected: boolean) => {
    return cn(
      "p-1 rounded-md text-xs transition-all duration-200 flex items-center justify-center h-8",
      {
        "bg-blue-50 hover:bg-blue-100 cursor-pointer border border-transparent hover:border-blue-300": available && !isSelected,
        "bg-gray-100 cursor-not-allowed text-gray-400": !available,
        "bg-blue-200 border border-blue-500": isSelected,
      }
    );
  };

  return (
    <Card className="md:col-span-2 bg-white/80 shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-500" />
          Select Time Slot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {availableTimeSlots.map((day) => (
            <div key={day.day} className="space-y-1">
              <div className="text-center font-semibold text-gray-700 pb-1 border-b text-sm">
                {getDayName(day.day)}
              </div>
              <div className="space-y-1">
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
                          onTimeSlotSelect(slotId);
                        }
                      }}
                    >
                      <span className="font-medium">{timeString}</span>
                    </div>
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