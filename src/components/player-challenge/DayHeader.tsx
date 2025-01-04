import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, addWeeks, addDays, startOfWeek } from "date-fns";

interface DayHeaderProps {
  day: number;
  isFullySelected: boolean;
  onSelectAll: () => void;
  selectedWeek?: number;
}

export const DayHeader = ({ 
  day, 
  isFullySelected, 
  onSelectAll,
  selectedWeek = 0 
}: DayHeaderProps) => {
  const getDate = () => {
    const baseDate = startOfWeek(addWeeks(new Date(), selectedWeek));
    return addDays(baseDate, day);
  };

  return (
    <div className="flex items-center justify-between gap-1">
      <div className="text-center font-semibold text-gray-700 pb-0.5 border-b text-xs">
        <div>{format(getDate(), 'EEE')}</div>
        <div className="text-[10px] text-gray-500">{format(getDate(), 'MMM d')}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
        onClick={onSelectAll}
      >
        {isFullySelected ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <div className="h-3 w-3 border border-gray-300 rounded" />
        )}
      </Button>
    </div>
  );
};