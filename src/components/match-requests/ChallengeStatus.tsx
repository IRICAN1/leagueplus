import { Button } from "@/components/ui/button";
import { Challenge, ChallengeType } from "@/types/match";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChallengeStatusProps {
  challenge: Challenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeStatus = ({ challenge, type, onResponse }: ChallengeStatusProps) => {
  const { toast } = useToast();
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800"
  };

  const createConversationAndSendMessage = async () => {
    try {
      // Create a new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;

      // Add both participants to the conversation
      const participantsPromises = [
        supabase
          .from('conversation_participants')
          .insert({
            conversation_id: conversation.id,
            profile_id: challenge.challenger_id,
            is_admin: false
          }),
        supabase
          .from('conversation_participants')
          .insert({
            conversation_id: conversation.id,
            profile_id: challenge.challenged_id,
            is_admin: false
          })
      ];

      await Promise.all(participantsPromises);

      // Send initial message
      const initialMessage = `Match challenge accepted! 🎾\nProposed time: ${new Date(challenge.proposed_time).toLocaleString()}\nLocation: ${challenge.location}`;
      
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: challenge.challenged_id,
          content: initialMessage
        });

    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation. Please try messaging manually.",
        variant: "destructive",
      });
    }
  };

  const handleResponse = async (accept: boolean) => {
    if (onResponse) {
      if (accept) {
        await createConversationAndSendMessage();
      }
      onResponse(challenge.id, accept);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4">
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[challenge.status]}`}>
        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
      </span>
      
      {type === 'received' && challenge.status === 'pending' && onResponse && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResponse(false)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => handleResponse(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
};