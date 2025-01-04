import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileMessageToggleProps {
  showList: boolean;
  onToggle: () => void;
  otherUser?: {
    fullName?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
  };
}

export const MobileMessageToggle = ({ 
  showList, 
  onToggle,
  otherUser 
}: MobileMessageToggleProps) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-gradient-to-r from-purple-50 to-blue-50 border-b p-4 flex items-center gap-3">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggle}
        className="p-2"
      >
        {showList ? (
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        ) : (
          <MessageSquare className="h-5 w-5 text-gray-600" />
        )}
      </Button>
      
      {!showList && otherUser && (
        <div className="flex items-center gap-3 animate-fade-in">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={otherUser.avatarUrl || undefined}
              alt={otherUser.fullName || otherUser.username || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100">
              {(otherUser.fullName?.[0] || otherUser.username?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-gray-800 truncate">
            {otherUser.fullName || otherUser.username || "Unknown User"}
          </span>
        </div>
      )}
    </div>
  );
};