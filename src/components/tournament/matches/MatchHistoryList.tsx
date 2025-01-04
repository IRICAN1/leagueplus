import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Trophy } from "lucide-react";

interface MatchHistoryListProps {
  leagueId: string;
}

export const MatchHistoryList = ({ leagueId }: MatchHistoryListProps) => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['match-history', leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_challenges')
        .select(`
          *,
          challenger:profiles!match_challenges_challenger_id_fkey(
            username,
            full_name,
            avatar_url
          ),
          challenged:profiles!match_challenges_challenged_id_fkey(
            username,
            full_name,
            avatar_url
          ),
          winner:profiles!match_challenges_winner_id_fkey(
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('league_id', leagueId)
        .eq('result_status', 'approved')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-gray-500">Loading matches...</div>
      </div>
    );
  }

  if (!matches?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No completed matches yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const isWinnerChallenger = match.winner_id === match.challenger_id;
        const winner = isWinnerChallenger ? match.challenger : match.challenged;
        const loser = isWinnerChallenger ? match.challenged : match.challenger;
        
        return (
          <div 
            key={match.id}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-green-500">
                  <AvatarImage src={winner?.avatar_url} />
                  <AvatarFallback>{winner?.full_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium text-green-600 truncate">
                    {winner?.full_name}
                    <Trophy className="h-4 w-4 inline ml-1 text-yellow-500" />
                  </p>
                  <p className="text-sm text-green-700">{match.winner_score}</p>
                </div>
              </div>

              <div className="text-sm font-medium text-gray-500">vs</div>

              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="min-w-0 text-right">
                  <p className="font-medium text-gray-600 truncate">{loser?.full_name}</p>
                  <p className="text-sm text-gray-700">{match.loser_score}</p>
                </div>
                <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-200">
                  <AvatarImage src={loser?.avatar_url} />
                  <AvatarFallback>{loser?.full_name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">
              {format(new Date(match.updated_at), 'MMM d, yyyy')}
            </div>
          </div>
        );
      })}
    </div>
  );
};