import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MessageButtonProps {
  currentUserId: string;
  otherUserId: string;
  challengeId: string;
  compact?: boolean;
}

export const MessageButton = ({ currentUserId, otherUserId, challengeId, compact = false }: MessageButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessageClick = async () => {
    try {
      const { data: existingParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', currentUserId);

      let conversationId = null;

      if (existingParticipations && existingParticipations.length > 0) {
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

      if (!conversationId) {
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({})
          .select()
          .single();

        if (conversationError) throw conversationError;

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
      onClick={handleMessageClick}
      className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      <MessageSquare className="h-3.5 w-3.5" />
      {!compact && <span className="ml-1">Message</span>}
    </Button>
  );
};