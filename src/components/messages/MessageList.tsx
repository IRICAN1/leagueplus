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

export const MessageList = ({ selectedConversation, onSelectConversation }: MessageListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          conversation_participants!inner(profile_id),
          messages!inner(
            id,
            content,
            created_at,
            sender_id,
            profiles!inner(username, avatar_url)
          )
        `)
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      return data;
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
          // Refetch conversations on any message changes
          void conversations?.refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversations]);

  const filteredConversations = conversations?.filter((conversation) =>
    conversation.messages[0]?.profiles.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading conversations...</div>
        ) : (
          <div className="divide-y">
            {filteredConversations?.map((conversation) => (
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
                      src={conversation.messages[0]?.profiles.avatar_url}
                      alt={conversation.messages[0]?.profiles.username}
                    />
                    <AvatarFallback>
                      {conversation.messages[0]?.profiles.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {conversation.messages[0]?.profiles.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(
                          new Date(conversation.messages[0]?.created_at),
                          "MMM d, h:mm a"
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.messages[0]?.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};