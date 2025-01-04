import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  conversationId: string | null;
  onMessageSent?: () => void;
}

export const ChatInput = ({ conversationId, onMessageSent }: ChatInputProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!conversationId || !newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages.",
          variant: "destructive",
        });
        return;
      }

      // First, verify that the user is a participant in this conversation
      const { data: participant, error: participantError } = await supabase
        .from("conversation_participants")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (participantError) {
        console.error("Error checking participant:", participantError);
        toast({
          title: "Error",
          description: "Failed to verify conversation participation.",
          variant: "destructive",
        });
        return;
      }

      if (!participant) {
        toast({
          title: "Error",
          description: "You are not a participant in this conversation.",
          variant: "destructive",
        });
        return;
      }

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          content: newMessage.trim(),
          sender_id: user.id,
        });

      if (messageError) {
        console.error("Error sending message:", messageError);
        throw messageError;
      }

      setNewMessage("");
      onMessageSent?.();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSendMessage();
            }
          }}
          className="flex-1"
          disabled={isSending}
        />
        <Button
          onClick={() => void handleSendMessage()}
          disabled={!newMessage.trim() || isSending}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};