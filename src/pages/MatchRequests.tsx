import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ChallengeCard } from "@/components/match-requests/ChallengeCard";
import { Challenge } from "@/types/match";

const MatchRequests = () => {
  const { toast } = useToast();

  const { data: challenges, isLoading, refetch } = useQuery({
    queryKey: ['match-challenges'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return { sent: [], received: [] };

      const [sentResponse, receivedResponse] = await Promise.all([
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenged:profiles!match_challenges_challenged_id_fkey(username, avatar_url),
            challenger:profiles!match_challenges_challenger_id_fkey(username, avatar_url),
            league:leagues(name)
          `)
          .eq('challenger_id', userId)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenged:profiles!match_challenges_challenged_id_fkey(username, avatar_url),
            challenger:profiles!match_challenges_challenger_id_fkey(username, avatar_url),
            league:leagues(name)
          `)
          .eq('challenged_id', userId)
          .order('created_at', { ascending: false })
      ]);

      if (sentResponse.error) throw sentResponse.error;
      if (receivedResponse.error) throw receivedResponse.error;

      return {
        sent: sentResponse.data as Challenge[],
        received: receivedResponse.data as Challenge[]
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
            challenges?.received.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                type="received"
                onResponse={handleResponse}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {challenges?.sent.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sent challenges</p>
          ) : (
            challenges?.sent.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                type="sent"
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchRequests;