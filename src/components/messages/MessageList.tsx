import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface MessageListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

interface Conversation {
  id: string;
  last_message_at: string;
  participants: {
    profile_id: string;
    profiles: {
      id: string;
      username: string;
      full_name: string;
      avatar_url: string;
    };
  }[];
  messages: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
  }[];
}

export const MessageList = ({ selectedConversation, onSelectConversation }: MessageListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getUser();
  }, []);

  const { data: conversations, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          participants:conversation_participants(
            profile_id,
            last_read_at,
            profiles(
              id,
              username,
              full_name,
              avatar_url
            )
          ),
          messages!inner(
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      // Calculate unread messages
      let totalUnread = 0;
      data?.forEach(conversation => {
        const userParticipant = conversation.participants.find(
          p => p.profile_id === user.id
        );
        if (userParticipant) {
          const unreadMessages = conversation.messages.filter(
            msg => msg.sender_id !== user.id && 
            new Date(msg.created_at) > new Date(userParticipant.last_read_at)
          ).length;
          totalUnread += unreadMessages;
        }
      });
      setUnreadCount(totalUnread);

      return data as Conversation[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          void refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.profile_id !== currentUserId)?.profiles;
  };

  const filteredConversations = conversations?.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant && 
      (otherParticipant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
       otherParticipant.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {!conversations ? (
          <div className="p-4 text-center text-gray-500">Loading conversations...</div>
        ) : (
          <div className="divide-y">
            {filteredConversations?.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              const userParticipant = conversation.participants.find(
                p => p.profile_id === currentUserId
              );
              const unreadMessages = conversation.messages.filter(
                msg => msg.sender_id !== currentUserId && 
                userParticipant && 
                new Date(msg.created_at) > new Date(userParticipant.last_read_at)
              ).length;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-4 hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={otherParticipant.avatar_url}
                        alt={otherParticipant.username}
                      />
                      <AvatarFallback>
                        {otherParticipant.full_name?.[0]?.toUpperCase() || 
                         otherParticipant.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {otherParticipant.full_name || otherParticipant.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(conversation.messages[0]?.created_at),
                            "MMM d, h:mm a"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.messages[0]?.content}
                        </p>
                        {unreadMessages > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {unreadMessages}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};