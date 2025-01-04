import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface NavbarNotificationsProps {
  unreadMessages: number;
}

export const NavbarNotifications = ({ unreadMessages }: NavbarNotificationsProps) => {
  return (
    <>
      {unreadMessages > 0 && (
        <Link to="/messages" className="relative inline-flex items-center">
          <MessageSquare className="h-6 w-6 text-blue-500 animate-pulse" />
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs ring-2 ring-white"
          >
            {unreadMessages}
          </Badge>
        </Link>
      )}
      {unreadMessages === 0 && (
        <Link to="/messages">
          <MessageSquare className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors" />
        </Link>
      )}
    </>
  );
};