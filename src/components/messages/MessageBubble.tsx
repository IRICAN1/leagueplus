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
      full_name: string;
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
      className={`flex items-start gap-2 ${
        isCurrentUser ? "flex-row-reverse" : ""
      } animate-fade-in`}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage
          src={message.profiles.avatar_url}
          alt={message.profiles.username}
        />
        <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100">
          {message.profiles.full_name?.charAt(0).toUpperCase() || 
           message.profiles.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className={`group max-w-[70%] space-y-1 ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div className="flex flex-col">
          <span className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? "text-right" : ""}`}>
            {message.profiles.full_name || message.profiles.username}
          </span>
          <div
            className={`rounded-2xl px-4 py-2 ${
              isCurrentUser
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <p className="text-sm break-words">{message.content}</p>
          </div>
        </div>
        <span className={`text-xs ${isCurrentUser ? "text-right" : ""} text-gray-500`}>
          {format(new Date(message.created_at), "h:mm a")}
        </span>
      </div>
    </div>
  );
};