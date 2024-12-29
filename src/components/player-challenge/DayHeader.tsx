import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DayHeaderProps {
  day: number;
  isFullySelected: boolean;
  onSelectAll: () => void;
}

export const DayHeader = ({ day, isFullySelected, onSelectAll }: DayHeaderProps) => {
  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  return (
    <div className="flex items-center justify-between gap-1">
      <div className="text-center font-semibold text-gray-700 pb-0.5 border-b text-xs">
        {getDayName(day)}
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