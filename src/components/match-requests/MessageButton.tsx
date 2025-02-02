import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      // First, check if a conversation already exists between these users
      const { data: existingConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', currentUserId);

      if (existingConversations) {
        for (const conv of existingConversations) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('profile_id')
            .eq('conversation_id', conv.conversation_id)
            .eq('profile_id', otherUserId)
            .maybeSingle();

          if (otherParticipant) {
            // Conversation exists, navigate to it
            navigate(`/messages?userId=${otherUserId}`);
            return;
          }
        }
      }

      // If no conversation exists, create a new one
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;

      if (newConversation) {
        // Add both users as participants
        const participantsPromises = [
          supabase
            .from('conversation_participants')
            .insert({
              conversation_id: newConversation.id,
              profile_id: currentUserId,
              is_admin: true
            }),
          supabase
            .from('conversation_participants')
            .insert({
              conversation_id: newConversation.id,
              profile_id: otherUserId,
              is_admin: false
            })
        ];

        await Promise.all(participantsPromises);

        // Send initial message about the challenge
        await supabase
          .from('messages')
          .insert({
            conversation_id: newConversation.id,
            sender_id: currentUserId,
            content: `Challenge #${challengeId} has been created. Let's discuss the details!`
          });

        toast({
          title: "Conversation Created",
          description: "You can now start messaging",
        });

        navigate(`/messages?userId=${otherUserId}`);
      }
    } catch (error: any) {
      console.error('Error handling message:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleMessageClick}
      className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
    >
      <MessageSquare className="h-4 w-4" />
    </Button>
  );
};