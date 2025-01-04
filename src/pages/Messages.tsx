import { useEffect, useState } from "react";
import { MessageList } from "@/components/messages/MessageList";
import { ChatArea } from "@/components/messages/ChatArea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const setupMessaging = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            if (payload.new.sender_id !== user.id) {
              toast({
                title: "New Message",
                description: "You have received a new message",
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    void setupMessaging();
  }, [toast]);

  // Handle conversation creation when navigating from a challenge
  useEffect(() => {
    const initializeConversation = async () => {
      const state = location.state as { otherUserId?: string; challengeId?: string } | null;
      if (!state?.otherUserId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if a conversation already exists between these users
      const { data: existingConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', user.id);

      if (existingConversations) {
        for (const conv of existingConversations) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('profile_id')
            .eq('conversation_id', conv.conversation_id)
            .eq('profile_id', state.otherUserId)
            .single();

          if (otherParticipant) {
            setSelectedConversation(conv.conversation_id);
            return;
          }
        }
      }

      // If no conversation exists, create a new one
      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (newConversation) {
        // Add both users to the conversation
        await Promise.all([
          supabase
            .from('conversation_participants')
            .insert({
              conversation_id: newConversation.id,
              profile_id: user.id,
              is_admin: true
            }),
          supabase
            .from('conversation_participants')
            .insert({
              conversation_id: newConversation.id,
              profile_id: state.otherUserId,
              is_admin: false
            })
        ]);

        // If there's a challenge ID, send an initial message
        if (state.challengeId) {
          await supabase
            .from('messages')
            .insert({
              conversation_id: newConversation.id,
              sender_id: user.id,
              content: "Let's discuss the match details!"
            });
        }

        setSelectedConversation(newConversation.id);
      }
    };

    void initializeConversation();
  }, [location.state]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border shadow-lg">
        <div className="w-1/3 border-r bg-white">
          <MessageList
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
        <div className="w-2/3 bg-white">
          <ChatArea conversationId={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default Messages;