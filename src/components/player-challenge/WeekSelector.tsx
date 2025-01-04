import { format, addWeeks, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeekSelectorProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

export const WeekSelector = ({ selectedWeek, onWeekChange }: WeekSelectorProps) => {
  const getWeekLabel = (weekOffset: number) => {
    const date = startOfWeek(addWeeks(new Date(), weekOffset));
    return format(date, "'Week of' MMM d");
  };

  const weeks = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Select Week</span>
        <span className="text-sm text-muted-foreground">
          {getWeekLabel(selectedWeek)}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {weeks.map((week) => (
          <Button
            key={week}
            variant="outline"
            size="sm"
            className={cn(
              "h-auto py-2 px-3",
              selectedWeek === week && "bg-green-100 border-green-500 hover:bg-green-200"
            )}
            onClick={() => onWeekChange(week)}
          >
            <div className="text-xs space-y-1">
              <div>{format(startOfWeek(addWeeks(new Date(), week)), 'MMM d')}</div>
              <div className="text-muted-foreground">Week {week + 1}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};