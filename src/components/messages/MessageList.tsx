import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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

      const { data: userConversations, error } = await supabase
        .from("conversation_participants")
        .select(`
          conversation:conversations (
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
            messages:messages (
              content,
              created_at,
              sender:profiles (
                username
              )
            )
          )
        `)
        .eq("profile_id", user.id)
        .order("conversation(last_message_at)", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        return [];
      }

      return userConversations
        .map((uc) => uc.conversation)
        .filter((c): c is Conversation => c !== null);
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
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
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
      <div className="flex h-full items-center justify-center text-gray-500">
        No conversations yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-4 p-4">
        {conversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const lastMessage = conversation.messages?.[0];

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full rounded-lg p-4 text-left transition-colors hover:bg-gray-100 ${
                selectedConversation === conversation.id
                  ? "bg-gray-100"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">
                  {conversation.title || otherParticipant?.username || "Unknown User"}
                </span>
                {lastMessage && (
                  <span className="text-xs text-gray-500">
                    {new Date(lastMessage.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              {lastMessage && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                  <span className="font-medium">
                    {lastMessage.sender.username}:
                  </span>{" "}
                  {lastMessage.content}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};