import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatAreaProps {
  conversationId: string | null;
}

export const ChatArea = ({ conversationId }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          profiles (
            username,
            avatar_url,
            full_name
          )
        `
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Update last_read_at
      await supabase
        .from("conversation_participants")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("profile_id", user.id);

      return data;
    },
    enabled: !!conversationId,
  });

  // Query to get other participant's info
  const { data: otherParticipant } = useQuery({
    queryKey: ["other-participant", conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: participants, error } = await supabase
        .from("conversation_participants")
        .select(`
          profile_id,
          profiles (
            username,
            avatar_url,
            full_name
          )
        `)
        .eq("conversation_id", conversationId)
        .neq("profile_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return participants;
    },
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          void refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, refetch]);

  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <div className="text-center space-y-4">
          <div className="text-purple-400">
            <svg className="w-20 h-20 mx-auto animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Select a Conversation</h3>
          <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={otherParticipant?.profiles?.avatar_url}
              alt={otherParticipant?.profiles?.username}
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100">
              {otherParticipant?.profiles?.full_name?.charAt(0) || 
               otherParticipant?.profiles?.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-800">
              {otherParticipant?.profiles?.full_name || otherParticipant?.profiles?.username}
            </h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {!messages ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </ScrollArea>
      <ChatInput conversationId={conversationId} onMessageSent={() => void refetch()} />
    </div>
  );
};