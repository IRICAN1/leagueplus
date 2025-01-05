import { Card } from "@/components/ui/card";
import { ResultSubmissionDialog } from "./ResultSubmissionDialog";
import { ResultApprovalCard } from "./ResultApprovalCard";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeDetails } from "./ChallengeDetails";
import { ChallengeStatus } from "./ChallengeStatus";
import { Challenge, ChallengeType } from "@/types/match";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ChallengeCardProps {
  challenge: Challenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeCard = ({ challenge, type, onResponse }: ChallengeCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUserId = type === 'sent' ? challenge.challenger_id : challenge.challenged_id;
  const otherUserId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;

  const isMatchTime = () => {
    const now = new Date();
    const matchTime = new Date(challenge.proposed_time);
    return now >= matchTime;
  };

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
        // Create new conversation
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
          challengeId: challenge.id 
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

  const renderResultSubmission = () => {
    if (challenge.status !== 'accepted' || !isMatchTime()) return null;
    if (!challenge.winner_id) {
      return <ResultSubmissionDialog challenge={challenge} />;
    }
    return null;
  };

  const parseScore = (score: string | null) => {
    if (!score) return [];
    return score.split('-').map(set => set.trim());
  };

  const renderScores = () => {
    if (challenge.status !== 'completed' || !challenge.winner_score) return null;
    const isWinner = challenge.winner_id === currentUserId;
    const winnerName = isWinner ? challenge.challenger.username : challenge.challenged.username;
    const loserName = !isWinner ? challenge.challenger.username : challenge.challenged.username;
    const winnerSets = parseScore(challenge.winner_score);
    const loserSets = parseScore(challenge.loser_score);

    // Add third set scores if they exist
    if (challenge.winner_score_set3) {
      winnerSets.push(challenge.winner_score_set3);
      loserSets.push(challenge.loser_score_set3);
    }

    return (
      <div className="mt-6 px-4">
        <Table className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50">
              <TableHead className="w-[200px] font-semibold text-gray-700">Player</TableHead>
              {winnerSets.map((_, index) => (
                <TableHead key={index} className="text-center w-24 font-semibold text-gray-700">
                  Set {index + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-blue-50/30 transition-colors">
              <TableCell className="font-medium text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                  <span className="font-semibold text-green-700">{winnerName}</span>
                </div>
              </TableCell>
              {winnerSets.map((score, index) => (
                <TableCell 
                  key={index} 
                  className="text-center font-bold text-green-600 bg-green-50/50"
                >
                  <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                    {score}
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="hover:bg-blue-50/30 transition-colors">
              <TableCell className="font-medium text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                  <span className="font-semibold text-red-700">{loserName}</span>
                </div>
              </TableCell>
              {loserSets.map((score, index) => (
                <TableCell 
                  key={index} 
                  className="text-center font-bold text-red-600 bg-red-50/50"
                >
                  <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 shadow-sm">
                    {score}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="p-6 mb-4 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-4">
          <ChallengeHeader challenge={challenge} type={type} />
          <ChallengeDetails challenge={challenge} />
        </div>
        <div className="flex flex-col gap-2">
          <ChallengeStatus 
            challenge={challenge} 
            type={type} 
            onResponse={onResponse} 
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleMessageClick}
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
        </div>
      </div>
      {renderScores()}
      {renderResultSubmission()}
      <ResultApprovalCard challenge={challenge} currentUserId={currentUserId} />
    </Card>
  );
};