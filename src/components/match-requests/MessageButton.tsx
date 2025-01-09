import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MessageButtonProps {
  currentUserId: string;
  otherUserId: string;
  challengeId: string;
  compact?: boolean;
}

export const MessageButton = ({ currentUserId, otherUserId, challengeId, compact = false }: MessageButtonProps) => {
  const navigate = useNavigate();

  const handleMessageClick = () => {
    navigate(`/messages?userId=${otherUserId}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleMessageClick}
      className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      <MessageSquare className="h-4 w-4" />
    </Button>
  );
};