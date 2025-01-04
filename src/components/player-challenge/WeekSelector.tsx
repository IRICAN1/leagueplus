import { Slider } from "@/components/ui/slider";
import { format, addWeeks, startOfWeek } from "date-fns";

interface WeekSelectorProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
}

export const WeekSelector = ({ selectedWeek, onWeekChange }: WeekSelectorProps) => {
  const handleValueChange = (value: number[]) => {
    onWeekChange(value[0]);
  };

  const getWeekLabel = (weekOffset: number) => {
    const date = startOfWeek(addWeeks(new Date(), weekOffset));
    return format(date, "'Week of' MMM d");
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Select Week</span>
        <span className="text-sm text-muted-foreground">
          {getWeekLabel(selectedWeek)}
        </span>
      </div>
      <Slider
        defaultValue={[0]}
        max={4}
        step={1}
        value={[selectedWeek]}
        onValueChange={handleValueChange}
        className="w-full"
      />
    </div>
  );
};