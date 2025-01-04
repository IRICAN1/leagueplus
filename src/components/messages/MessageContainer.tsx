import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageContainerProps {
  children: (props: {
    selectedConversation: string | null;
    showList: boolean;
    setShowList: (show: boolean) => void;
    onSelectConversation: (id: string) => void;
    otherUser: {
      fullName?: string | null;
      username?: string | null;
      avatarUrl?: string | null;
    } | null;
  }) => React.ReactNode;
}

export const MessageContainer = ({ children }: MessageContainerProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const [otherUser, setOtherUser] = useState<{
    fullName?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
  } | null>(null);
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
      const state = location.state as { otherUserId?: string } | null;
      if (!state?.otherUserId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, check if a conversation already exists between these users
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
            .maybeSingle();

          if (otherParticipant) {
            setSelectedConversation(conv.conversation_id);
            if (isMobile) setShowList(false);
            return;
          }
        }
      }

      // If no conversation exists, create a new one
      try {
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
          ];

          await Promise.all(participantsPromises);
          
          setSelectedConversation(newConversation.id);
          if (isMobile) setShowList(false);

          toast({
            title: "Conversation Created",
            description: "You can now start messaging",
          });
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
        toast({
          title: "Error",
          description: "Failed to create conversation. Please try again.",
          variant: "destructive",
        });
      }
    };

    void initializeConversation();
  }, [location.state, isMobile, toast]);

  const handleSelectConversation = async (id: string) => {
    setSelectedConversation(id);
    if (isMobile) setShowList(false);

    // Fetch other user's information
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: participant } = await supabase
      .from("conversation_participants")
      .select(`
        profiles (
          full_name,
          username,
          avatar_url
        )
      `)
      .eq("conversation_id", id)
      .neq("profile_id", user.id)
      .maybeSingle();

    if (participant?.profiles) {
      setOtherUser({
        fullName: participant.profiles.full_name,
        username: participant.profiles.username,
        avatarUrl: participant.profiles.avatar_url,
      });
    }
  };

  return children({
    selectedConversation,
    showList,
    setShowList,
    onSelectConversation: handleSelectConversation,
    otherUser,
  });
};