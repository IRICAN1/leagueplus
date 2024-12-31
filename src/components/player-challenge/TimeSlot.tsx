import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: number;
  isSelected: boolean;
  isAvailable: boolean;
  isPast: boolean;
  onClick: () => void;
}

export const TimeSlot = ({ 
  time, 
  isSelected, 
  isAvailable,
  isPast,
  onClick 
}: TimeSlotProps) => {
  const timeString = `${format(new Date().setHours(time), 'ha')}`;
  
  const slotClassName = cn(
    "p-0.5 rounded text-[10px] transition-all duration-200 flex items-center justify-center h-6",
    {
      // Available slots (green)
      "bg-green-100 hover:bg-green-200 cursor-pointer border-[0.5px] border-transparent hover:border-green-300": 
        isAvailable && !isSelected && !isPast,
      
      // Selected slot (dark green)
      "bg-green-500 text-white border-[0.5px] border-green-600": 
        isSelected && !isPast,
      
      // Unavailable slots (gray)
      "bg-gray-100 cursor-not-allowed text-gray-500": 
        !isAvailable && !isPast,
      
      // Past slots (neutral/disabled)
      "bg-gray-50 cursor-not-allowed text-gray-400": 
        isPast,
    }
  );

  return (
    <div 
      className={slotClassName} 
      onClick={() => {
        if (isAvailable && !isPast) {
          onClick();
        }
      }}
    >
      <span className="font-medium">{timeString}</span>
    </div>
  );
};