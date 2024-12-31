import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const MatchRequests = () => {
  const { toast } = useToast();

  // Fetch both sent and received challenges
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  const { data: challenges, isLoading, refetch } = useQuery({
    queryKey: ['match-challenges', userId],
    queryFn: async () => {
      if (!userId) return { sent: [], received: [] };

      const [sentResponse, receivedResponse] = await Promise.all([
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenged:profiles!match_challenges_challenged_id_fkey(username),
            league:leagues(name)
          `)
          .eq('challenger_id', userId)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenger:profiles!match_challenges_challenger_id_fkey(username),
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
    },
    enabled: !!userId
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

    return (
      <Card key={challenge.id} className="p-6 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">
              {type === 'sent' 
                ? `Challenge to ${challenge.challenged.username}`
                : `Challenge from ${challenge.challenger.username}`}
            </h3>
            <p className="text-sm text-gray-600">League: {challenge.league.name}</p>
            <p className="text-sm text-gray-600">
              Date: {format(new Date(challenge.proposed_time), 'PPp')}
            </p>
            <p className="text-sm text-gray-600">Location: {challenge.location}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-2 py-1 rounded-full text-sm ${statusColors[challenge.status]}`}>
              {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
            </span>
          </div>
        </div>
        
        {type === 'received' && challenge.status === 'pending' && (
          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => handleResponse(challenge.id, false)}
            >
              Decline
            </Button>
            <Button
              onClick={() => handleResponse(challenge.id, true)}
            >
              Accept
            </Button>
          </div>
        )}
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