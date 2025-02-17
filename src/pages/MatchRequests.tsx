
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ChallengeCard } from "@/components/match-requests/ChallengeCard";
import { DuoChallengeCard } from "@/components/match-requests/DuoChallengeCard";
import { Challenge, DuoChallenge } from "@/types/match";

const MatchRequests = () => {
  const { toast } = useToast();

  const { data: individualChallenges, isLoading: individualLoading, refetch: refetchIndividual } = useQuery({
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

      return [
        ...sentResponse.data.map(c => ({ ...c, challengeType: 'sent' as const })),
        ...receivedResponse.data.map(c => ({ ...c, challengeType: 'received' as const }))
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  });

  const { data: duoChallenges, isLoading: duoLoading, refetch: refetchDuo } = useQuery({
    queryKey: ['duo-match-challenges'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return [];

      const { data: partnerships } = await supabase
        .from('duo_partnerships')
        .select('id')
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`);

      if (!partnerships?.length) return [];

      const partnershipIds = partnerships.map(p => p.id);

      const [sentResponse, receivedResponse] = await Promise.all([
        supabase
          .from('duo_match_challenges')
          .select(`
            *,
            challenger_partnership:duo_partnerships!duo_match_challenges_challenger_partnership_id_fkey(
              id,
              player1:profiles!duo_partnerships_player1_id_fkey(id, username, full_name, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey(id, username, full_name, avatar_url)
            ),
            challenged_partnership:duo_partnerships!duo_match_challenges_challenged_partnership_id_fkey(
              id,
              player1:profiles!duo_partnerships_player1_id_fkey(id, username, full_name, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey(id, username, full_name, avatar_url)
            ),
            league:duo_leagues(name)
          `)
          .in('challenger_partnership_id', partnershipIds)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('duo_match_challenges')
          .select(`
            *,
            challenger_partnership:duo_partnerships!duo_match_challenges_challenger_partnership_id_fkey(
              id,
              player1:profiles!duo_partnerships_player1_id_fkey(id, username, full_name, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey(id, username, full_name, avatar_url)
            ),
            challenged_partnership:duo_partnerships!duo_match_challenges_challenged_partnership_id_fkey(
              id,
              player1:profiles!duo_partnerships_player1_id_fkey(id, username, full_name, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey(id, username, full_name, avatar_url)
            ),
            league:duo_leagues(name)
          `)
          .in('challenged_partnership_id', partnershipIds)
          .order('created_at', { ascending: false })
      ]);

      if (sentResponse.error) throw sentResponse.error;
      if (receivedResponse.error) throw receivedResponse.error;

      return [
        ...sentResponse.data.map(c => ({ ...c, challengeType: 'sent' as const })),
        ...receivedResponse.data.map(c => ({ ...c, challengeType: 'received' as const }))
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) as DuoChallenge[];
    }
  });

  const handleIndividualResponse = async (challengeId: string, accept: boolean) => {
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

      refetchIndividual();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDuoResponse = async (challengeId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('duo_match_challenges')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: accept ? "Duo Challenge Accepted!" : "Duo Challenge Rejected",
        description: accept 
          ? "The challenging duo has been notified of your acceptance."
          : "The challenging duo has been notified of your decision.",
      });

      refetchDuo();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (individualLoading || duoLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasIndividualMatches = individualChallenges && individualChallenges.length > 0;
  const hasDuoMatches = duoChallenges && duoChallenges.length > 0;

  const getRecentMatches = (challenges: Challenge[]) => {
    return challenges?.filter(c => 
      c.status === 'pending' || 
      (c.status === 'completed' && new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const getRecentDuoMatches = (challenges: DuoChallenge[]) => {
    return challenges?.filter(c => 
      c.status === 'pending' || 
      (c.status === 'completed' && new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Matches</h1>
      
      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="individual">Individual Matches</TabsTrigger>
          <TabsTrigger value="duo">Duo Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Matches</TabsTrigger>
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="history">Match History</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {!hasIndividualMatches ? (
                <p className="text-gray-500 text-center py-8">No recent matches found</p>
              ) : (
                <div className="grid gap-4">
                  {getRecentMatches(individualChallenges).map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      type={challenge.challengeType}
                      onResponse={handleIndividualResponse}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {!hasIndividualMatches ? (
                <p className="text-gray-500 text-center py-8">No individual challenges found</p>
              ) : (
                <div className="grid gap-4">
                  {individualChallenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      type={challenge.challengeType}
                      onResponse={handleIndividualResponse}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {!hasIndividualMatches || !individualChallenges?.filter(c => c.status === 'completed')?.length ? (
                <p className="text-gray-500 text-center py-8">No completed individual matches yet</p>
              ) : (
                <div className="grid gap-4">
                  {individualChallenges
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
        </TabsContent>

        <TabsContent value="duo" className="space-y-4">
          <Tabs defaultValue="recent" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Duo Matches</TabsTrigger>
              <TabsTrigger value="all">All Duo Challenges</TabsTrigger>
              <TabsTrigger value="history">Duo Match History</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              {!hasDuoMatches ? (
                <p className="text-gray-500 text-center py-8">No recent duo matches found</p>
              ) : (
                <div className="grid gap-4">
                  {getRecentDuoMatches(duoChallenges).map(challenge => (
                    <DuoChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      type={challenge.challengeType}
                      onResponse={handleDuoResponse}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {!hasDuoMatches ? (
                <p className="text-gray-500 text-center py-8">No duo challenges found</p>
              ) : (
                <div className="grid gap-4">
                  {duoChallenges.map(challenge => (
                    <DuoChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      type={challenge.challengeType}
                      onResponse={handleDuoResponse}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {!hasDuoMatches || !duoChallenges?.filter(c => c.status === 'completed')?.length ? (
                <p className="text-gray-500 text-center py-8">No completed duo matches yet</p>
              ) : (
                <div className="grid gap-4">
                  {duoChallenges
                    ?.filter(c => c.status === 'completed')
                    .map(challenge => (
                      <DuoChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        type={challenge.challengeType}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchRequests;
