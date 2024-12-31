import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: number;
  isSelected: boolean;
  isAvailable?: boolean;
  onClick: () => void;
}

export const TimeSlot = ({ time, isSelected, isAvailable = true, onClick }: TimeSlotProps) => {
  const timeString = `${format(new Date().setHours(time), 'ha')}`;
  
  const slotClassName = cn(
    "p-0.5 rounded text-[10px] transition-all duration-200 flex items-center justify-center h-6",
    {
      "bg-green-100 hover:bg-green-200 cursor-pointer border-[0.5px] border-transparent hover:border-green-400": isAvailable && !isSelected,
      "bg-green-500 text-white border-[0.5px] border-green-600": isSelected && isAvailable,
      "bg-gray-100 text-gray-400 cursor-not-allowed": !isAvailable,
    }
  );

  const handleClick = () => {
    if (isAvailable) {
      onClick();
    }
  };

  return (
    <div className={slotClassName} onClick={handleClick}>
      <span className="font-medium">{timeString}</span>
    </div>
  );
};