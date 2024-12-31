import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Trophy, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['match-history'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return [];

      const { data, error } = await supabase
        .from('match_challenges')
        .select(`
          *,
          league:leagues(name),
          challenger:profiles!match_challenges_challenger_id_fkey(username, avatar_url),
          challenged:profiles!match_challenges_challenged_id_fkey(username, avatar_url)
        `)
        .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Match History</h1>
      <div className="space-y-4">
        {matches?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No completed matches yet</p>
        ) : (
          matches?.map((match) => {
            const isWinner = match.winner_id === match.challenger_id;
            const winnerName = isWinner ? match.challenger.username : match.challenged.username;
            const loserName = !isWinner ? match.challenger.username : match.challenged.username;

            return (
              <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{match.league.name}</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {format(new Date(match.proposed_time), 'PPp')}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          {match.location}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600">
                      <Trophy className="h-4 w-4 mr-1" />
                      Winner: {winnerName}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="text-center flex-1">
                        <p className="font-medium">{match.challenger.username}</p>
                        <p className="text-sm text-gray-500">Challenger</p>
                      </div>
                      <div className="flex items-center gap-4 px-6">
                        <span className="text-lg font-semibold">
                          {isWinner ? match.winner_score : match.loser_score}
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="text-lg font-semibold">
                          {!isWinner ? match.winner_score : match.loser_score}
                        </span>
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-medium">{match.challenged.username}</p>
                        <p className="text-sm text-gray-500">Challenged</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
};

export default History;