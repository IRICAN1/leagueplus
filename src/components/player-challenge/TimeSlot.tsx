import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeSlotProps {
  time: number;
  isSelected: boolean;
  isAvailable?: boolean;
  onClick: () => void;
}

export const TimeSlot = ({ time, isSelected, isAvailable = true, onClick }: TimeSlotProps) => {
  const isMobile = useIsMobile();
  const timeString = `${format(new Date().setHours(time), 'ha')}`;
  
  const slotClassName = cn(
    "rounded transition-all duration-200 flex items-center justify-center",
    {
      "bg-green-100 hover:bg-green-200 cursor-pointer border-[0.5px] border-transparent hover:border-green-400": isAvailable && !isSelected,
      "bg-green-500 text-white border-[0.5px] border-green-600": isSelected && isAvailable,
      "bg-gray-100 text-gray-400 cursor-not-allowed": !isAvailable,
    },
    isMobile ? "h-8 text-[11px] p-1" : "h-6 text-[10px] p-0.5"
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