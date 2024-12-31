import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Trophy } from "lucide-react";
import { format } from "date-fns";

const History = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['match-history'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return [];

      const { data, error } = await supabase
        .from('match_history')
        .select(`
          *,
          league:leagues(name),
          opponent:profiles!match_history_opponent_id_fkey(username)
        `)
        .eq('player_id', userId)
        .order('match_date', { ascending: false });

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
          <p className="text-gray-500 text-center py-8">No matches played yet</p>
        ) : (
          matches?.map((match) => (
            <Card key={match.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{match.league.name}</h3>
                  <p className="text-sm text-gray-600">
                    vs {match.opponent.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(match.match_date), 'PPp')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {match.result === 'win' && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className={`font-semibold ${
                    match.result === 'win' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {match.result.toUpperCase()}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default History;