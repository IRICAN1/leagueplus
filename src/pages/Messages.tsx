import { useEffect, useState } from "react";
import { MessageList } from "@/components/messages/MessageList";
import { ChatArea } from "@/components/messages/ChatArea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { MobileMessageToggle } from "@/components/messages/MobileMessageToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();

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

  useEffect(() => {
    const initializeConversation = async () => {
      const state = location.state as { otherUserId?: string; challengeId?: string } | null;
      if (!state?.otherUserId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
            if (isMobile) setShowList(false);
            return;
          }
        }
      }

      const { data: newConversation } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (newConversation) {
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
        if (isMobile) setShowList(false);
      }
    };

    void initializeConversation();
  }, [location.state, isMobile]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    if (isMobile) setShowList(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <MobileMessageToggle showList={showList} onToggle={() => setShowList(!showList)} />
      <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border shadow-lg">
        <div 
          className={`${
            isMobile ? 'w-full absolute inset-0 z-20 bg-white transition-transform duration-300 transform' : 'w-1/3'
          } ${
            isMobile && !showList ? 'translate-x-[-100%]' : 'translate-x-0'
          } border-r bg-white`}
        >
          <MessageList
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <div 
          className={`${
            isMobile ? 'w-full absolute inset-0 bg-white transition-transform duration-300 transform' : 'w-2/3'
          } ${
            isMobile && showList ? 'translate-x-[100%]' : 'translate-x-0'
          }`}
        >
          <ChatArea conversationId={selectedConversation} />
        </div>
      </div>
    </div>
  );
};

export default Messages;