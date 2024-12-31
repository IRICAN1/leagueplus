import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const MatchRequests = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: challenges, isLoading, refetch } = useQuery({
    queryKey: ['match-challenges'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) return { sent: [], received: [] };

      const [sentResponse, receivedResponse] = await Promise.all([
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenged:profiles!match_challenges_challenged_id_fkey(username, avatar_url),
            league:leagues(name)
          `)
          .eq('challenger_id', userId)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenger:profiles!match_challenges_challenger_id_fkey(username, avatar_url),
            league:leagues(name)
          `)
          .eq('challenged_id', userId)
          .order('created_at', { ascending: false })
      ]);

      if (sentResponse.error) throw sentResponse.error;
      if (receivedResponse.error) throw receivedResponse.error;

      return {
        sent: sentResponse.data,
        received: receivedResponse.data
      };
    }
  });

  const handleResponse = async (challengeId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('match_challenges')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: accept ? "Challenge Accepted!" : "Challenge Rejected",
        description: accept 
          ? "The challenger has been notified of your acceptance."
          : "The challenger has been notified of your decision.",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderChallengeCard = (challenge: any, type: 'sent' | 'received') => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-gray-100 text-gray-800"
    };

    const profile = type === 'sent' ? challenge.challenged : challenge.challenger;
    const profileId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;

    const handleProfileClick = () => {
      navigate(`/profile/${profileId}`);
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
                  <Trophy className="h-4 w-4 text-purple-500" />
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
            
            {type === 'received' && challenge.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(challenge.id, false)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResponse(challenge.id, true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Accept
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Match Requests</h1>
      
      <Tabs defaultValue="received" className="space-y-6">
        <TabsList>
          <TabsTrigger value="received">Received Challenges</TabsTrigger>
          <TabsTrigger value="sent">Sent Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {challenges?.received.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No received challenges</p>
          ) : (
            challenges?.received.map(challenge => renderChallengeCard(challenge, 'received'))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {challenges?.sent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sent challenges</p>
          ) : (
            challenges?.sent.map(challenge => renderChallengeCard(challenge, 'sent'))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchRequests;
