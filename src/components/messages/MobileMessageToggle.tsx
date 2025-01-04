import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMessageToggleProps {
  showList: boolean;
  onToggle: () => void;
}

export const MobileMessageToggle = ({ showList, onToggle }: MobileMessageToggleProps) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onToggle}
      className="md:hidden fixed top-20 left-4 z-10"
    >
      {showList ? (
        <ArrowLeft className="h-5 w-5" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      )}
    </Button>
  );
};