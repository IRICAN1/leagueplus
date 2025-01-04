import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    profiles: {
      username: string;
      avatar_url: string;
    };
  };
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    void getCurrentUser();
  }, []);

  const isCurrentUser = message.sender_id === currentUserId;

  return (
    <div
      className={`flex items-start gap-3 ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={message.profiles.avatar_url}
          alt={message.profiles.username}
        />
        <AvatarFallback>
          {message.profiles.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100"
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <span className={`mt-1 text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
          {format(new Date(message.created_at), "h:mm a")}
        </span>
      </div>
    </div>
  );
};