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
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!conversationId || !newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, verify that the user is a participant in this conversation
      const { data: participant } = await supabase
        .from("conversation_participants")
        .select("*")
        .eq("conversation_id", conversationId)
        .eq("profile_id", user.id)
        .single();

      if (!participant) {
        toast({
          title: "Error",
          description: "You are not a participant in this conversation.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        content: newMessage.trim(),
        sender_id: user.id,
      });

      if (error) throw error;

      setNewMessage("");
      onMessageSent?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
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
            if (e.key === "Enter") {
              void handleSendMessage();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={() => void handleSendMessage()}
          disabled={!newMessage.trim()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};