import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface Conversation {
  id: string;
  title: string | null;
  last_message_at: string;
  participants: {
    profile_id: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
  }[];
  messages: {
    content: string;
    created_at: string;
    sender: {
      username: string;
    };
  }[];
}

interface MessageListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

export const MessageList = ({
  selectedConversation,
  onSelectConversation,
}: MessageListProps) => {
  const { toast } = useToast();
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

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First, get the conversation IDs the user is part of
      const { data: participations, error: participationsError } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("profile_id", user.id);

      if (participationsError) {
        console.error("Error fetching participations:", participationsError);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        return [];
      }

      const conversationIds = participations.map(p => p.conversation_id);
      
      if (conversationIds.length === 0) return [];

      // Then, get the full conversation details
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          title,
          last_message_at,
          participants:conversation_participants (
            profile_id,
            profiles (
              username,
              avatar_url
            )
          ),
          messages (
            content,
            created_at,
            sender:profiles (
              username
            )
          )
        `)
        .in("id", conversationIds)
        .order("last_message_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        return [];
      }

      return (data || []) as Conversation[];
    },
    enabled: !!currentUserId,
  });

  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUserId || !conversation.participants) return null;
    
    const otherParticipant = conversation.participants.find(
      (p) => p.profile_id !== currentUserId
    );
    
    return otherParticipant?.profiles;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-3 animate-pulse">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="text-gray-400">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No conversations yet</p>
          <p className="text-gray-400 text-sm">Start a new conversation by challenging a player!</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-1 p-4">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const lastMessage = conversation.messages?.[0];
          const isSelected = selectedConversation === conversation.id;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full rounded-lg p-3 text-left transition-all hover:bg-gray-100 ${
                isSelected
                  ? "bg-purple-50 hover:bg-purple-100 shadow-sm"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-purple-100">
                  <AvatarImage
                    src={otherParticipant?.avatar_url || ""}
                    alt={otherParticipant?.username || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100">
                    {otherParticipant?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 truncate">
                      {conversation.title || otherParticipant?.username || "Unknown User"}
                    </span>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(lastMessage.created_at), "h:mm a")}
                      </span>
                    )}
                  </div>
                  {lastMessage && (
                    <p className="mt-1 text-sm text-gray-600 truncate">
                      <span className="font-medium">
                        {lastMessage.sender.username === otherParticipant?.username ? "" : "You: "}
                      </span>
                      {lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};