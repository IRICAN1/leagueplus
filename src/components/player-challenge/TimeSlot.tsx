import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: number;
  isSelected: boolean;
  isMatchingSlot?: boolean;
  onClick: () => void;
}

export const TimeSlot = ({ time, isSelected, isMatchingSlot, onClick }: TimeSlotProps) => {
  const timeString = `${format(new Date().setHours(time), 'ha')}`;
  
  const slotClassName = cn(
    "p-0.5 rounded text-[10px] transition-all duration-200 flex items-center justify-center h-6",
    {
      "bg-blue-50 hover:bg-blue-100 cursor-pointer border-[0.5px] border-transparent hover:border-blue-300": !isSelected && !isMatchingSlot,
      "bg-blue-200 border-[0.5px] border-blue-500": isSelected,
      "bg-green-50 hover:bg-green-100 cursor-pointer border-[0.5px] border-transparent hover:border-green-300": !isSelected && isMatchingSlot,
      "opacity-50 cursor-not-allowed": !isMatchingSlot,
    }
  );

  return (
    <div 
      className={slotClassName} 
      onClick={isMatchingSlot ? onClick : undefined}
      title={isMatchingSlot ? "Available for both players" : "Not available for both players"}
    >
      <span className="font-medium">{timeString}</span>
    </div>
  );
};