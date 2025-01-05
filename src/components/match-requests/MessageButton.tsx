import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MessageButtonProps {
  currentUserId: string;
  otherUserId: string;
  challengeId: string;
}

export const MessageButton = ({ currentUserId, otherUserId, challengeId }: MessageButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessageClick = async () => {
    try {
      // First, check if a conversation already exists between these users
      const { data: existingParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', currentUserId);

      let conversationId = null;

      if (existingParticipations && existingParticipations.length > 0) {
        // Check each conversation to see if the other user is also a participant
        for (const participation of existingParticipations) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('*')
            .eq('conversation_id', participation.conversation_id)
            .eq('profile_id', otherUserId)
            .single();

          if (otherParticipant) {
            conversationId = participation.conversation_id;
            break;
          }
        }
      }

      // If no existing conversation found, create a new one
      if (!conversationId) {
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({})
          .select()
          .single();

        if (conversationError) throw conversationError;

        // Add both users as participants
        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            {
              conversation_id: newConversation.id,
              profile_id: currentUserId,
              is_admin: true
            },
            {
              conversation_id: newConversation.id,
              profile_id: otherUserId,
              is_admin: true
            }
          ]);

        if (participantsError) throw participantsError;

        conversationId = newConversation.id;
      }

      // Navigate to messages with the conversation ID
      navigate('/messages', { 
        state: { 
          conversationId,
          otherUserId,
          challengeId 
        } 
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleMessageClick}
    >
      <MessageSquare className="h-4 w-4" />
      Message
    </Button>
  );
};