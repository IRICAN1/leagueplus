import { useEffect, useState } from "react";
import { MessageList } from "@/components/messages/MessageList";
import { ChatArea } from "@/components/messages/ChatArea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const { sender_id, conversation_id } = payload.new;
            if (sender_id !== supabase.auth.user()?.id) {
              toast({
                title: "New Message",
                description: "You have received a new message",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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