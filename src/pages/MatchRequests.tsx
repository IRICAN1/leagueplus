import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ChallengeCard } from "@/components/match-requests/ChallengeCard";
import { Challenge } from "@/types/match";

const MatchRequests = () => {
  const { toast } = useToast();

  const { data: challenges, isLoading: challengesLoading, refetch } = useQuery({
    queryKey: ['match-challenges'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return [];

      const [sentResponse, receivedResponse] = await Promise.all([
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenged:profiles!match_challenges_challenged_id_fkey(username, full_name, avatar_url),
            challenger:profiles!match_challenges_challenger_id_fkey(username, full_name, avatar_url),
            league:leagues(name)
          `)
          .eq('challenger_id', userId)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('match_challenges')
          .select(`
            *,
            challenged:profiles!match_challenges_challenged_id_fkey(username, full_name, avatar_url),
            challenger:profiles!match_challenges_challenger_id_fkey(username, full_name, avatar_url),
            league:leagues(name)
          `)
          .eq('challenged_id', userId)
          .order('created_at', { ascending: false })
      ]);

      if (sentResponse.error) throw sentResponse.error;
      if (receivedResponse.error) throw receivedResponse.error;

      // Combine and sort all challenges by date
      const allChallenges = [
        ...sentResponse.data.map(c => ({ ...c, challengeType: 'sent' as const })),
        ...receivedResponse.data.map(c => ({ ...c, challengeType: 'received' as const }))
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return allChallenges;
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

  if (challengesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Matches</h1>
      
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {!challenges?.length ? (
            <p className="text-gray-500 text-center py-8">No challenges found</p>
          ) : (
            <div className="grid gap-4">
              {challenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  type={challenge.challengeType}
                  onResponse={handleResponse}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {challenges?.filter(c => c.status === 'completed')?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completed matches yet</p>
          ) : (
            <div className="grid gap-4">
              {challenges
                ?.filter(c => c.status === 'completed')
                .map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    type={challenge.challengeType}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchRequests;