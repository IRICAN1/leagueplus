import { format } from "date-fns";
import { Award, Calendar, MapPin, ExternalLink, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChallengeCardProps {
  challenge: any;
  type: 'sent' | 'received';
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeCard = ({ challenge, type, onResponse }: ChallengeCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winnerScore, setWinnerScore] = useState("");
  const [loserScore, setLoserScore] = useState("");
  const [winnerId, setWinnerId] = useState<string>("");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800"
  };

  const profile = type === 'sent' ? challenge.challenged : challenge.challenger;
  const profileId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;
  const currentUserId = type === 'sent' ? challenge.challenger_id : challenge.challenged_id;
  const opponent = type === 'sent' ? challenge.challenged : challenge.challenger;

  const handleProfileClick = () => {
    navigate(`/profile/${profileId}`);
  };

  const isMatchTime = () => {
    const now = new Date();
    const matchTime = new Date(challenge.proposed_time);
    return now >= matchTime;
  };

  const handleResultSubmit = async () => {
    if (!winnerScore || !loserScore || !winnerId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('match_challenges')
        .update({
          winner_id: winnerId,
          winner_score: winnerScore,
          loser_score: loserScore,
          status: 'completed',
          result_status: 'pending'
        })
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: "Result submitted",
        description: "Waiting for opponent's approval",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResultApproval = async (approved: boolean) => {
    try {
      const { error } = await supabase
        .from('match_challenges')
        .update({
          result_status: approved ? 'approved' : 'disputed'
        })
        .eq('id', challenge.id);

      if (error) throw error;

      toast({
        title: approved ? "Result approved" : "Result disputed",
        description: approved 
          ? "The match result has been confirmed"
          : "The match result has been marked as disputed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderResultSubmission = () => {
    if (challenge.status !== 'accepted' || !isMatchTime()) return null;

    if (challenge.result_status === 'pending' && challenge.winner_id) {
      // Show approval UI for the opponent
      if (currentUserId !== challenge.winner_id) {
        return (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Match Result Pending Approval</p>
            <p className="text-sm mb-3">
              Score: {challenge.winner_score} - {challenge.loser_score}
              <br />
              Winner: {challenge.winner_id === challenge.challenger_id 
                ? challenge.challenger.username 
                : challenge.challenged.username}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResultApproval(false)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Dispute
              </Button>
              <Button
                size="sm"
                onClick={() => handleResultApproval(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
            </div>
          </div>
        );
      }
      return (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm">Waiting for opponent to approve the result</p>
        </div>
      );
    }

    if (!challenge.winner_id) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              Submit Match Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Match Result</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup
                value={winnerId}
                onValueChange={setWinnerId}
                className="flex flex-col space-y-2"
              >
                <Label>Winner</Label>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={challenge.challenger_id} id="challenger" />
                  <Label htmlFor="challenger">{challenge.challenger.username}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={challenge.challenged_id} id="challenged" />
                  <Label htmlFor="challenged">{challenge.challenged.username}</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Winner Score</Label>
                  <Input
                    placeholder="6"
                    value={winnerScore}
                    onChange={(e) => setWinnerScore(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loser Score</Label>
                  <Input
                    placeholder="4"
                    value={loserScore}
                    onChange={(e) => setLoserScore(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleResultSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Submit Result
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  };

  return (
    <Card key={challenge.id} className="p-6 mb-4 hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-blue-100 cursor-pointer hover:ring-blue-300 transition-all"
                  onClick={handleProfileClick}>
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-medium">
                {profile.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {type === 'sent' 
                  ? `Challenge to ${profile.username}`
                  : `Challenge from ${profile.username}`}
              </h3>
              <button 
                onClick={handleProfileClick}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                {challenge.league.name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                {format(new Date(challenge.proposed_time), 'PPp')}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                {challenge.location}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[challenge.status]}`}>
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </span>
          
          {type === 'received' && challenge.status === 'pending' && onResponse && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onResponse(challenge.id, false)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => onResponse(challenge.id, true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </div>
      {renderResultSubmission()}
    </Card>
  );
};