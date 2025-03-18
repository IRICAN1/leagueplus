
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Trophy, Star, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MatchHistoryListProps {
  leagueId: string;
  isDuo?: boolean;
}

// Helper function to determine if a match is a duo match
const isDuoMatch = (match: any): match is {
  challenger_partnership_id: string;
  challenged_partnership_id: string;
  challenger_partnership: any;
  challenged_partnership: any;
  winner_partnership_id: string;
} => {
  return 'challenger_partnership_id' in match && 
         'challenged_partnership_id' in match &&
         'winner_partnership_id' in match;
};

export const MatchHistoryList = ({ leagueId, isDuo }: MatchHistoryListProps) => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['match-history', leagueId, isDuo],
    queryFn: async () => {
      if (isDuo) {
        const { data, error } = await supabase
          .from('duo_match_challenges')
          .select(`
            *,
            challenger_partnership:duo_partnerships!duo_match_challenges_challenger_partnership_id_fkey(
              id,
              player1:profiles!duo_partnerships_player1_id_fkey(username, full_name, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey(username, full_name, avatar_url),
              duo_statistics(points, wins, losses)
            ),
            challenged_partnership:duo_partnerships!duo_match_challenges_challenged_partnership_id_fkey(
              id,
              player1:profiles!duo_partnerships_player1_id_fkey(username, full_name, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey(username, full_name, avatar_url),
              duo_statistics(points, wins, losses)
            ),
            league:duo_leagues(name)
          `)
          .eq('league_id', leagueId)
          .eq('result_status', 'approved')
          .eq('status', 'completed')
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        // Add console logs to check the data
        console.log('Duo match history data:', data);
        if (data && data.length > 0) {
          console.log('Sample match statistics:', {
            winner: data[0].winner_partnership_id === data[0].challenger_partnership_id 
              ? data[0].challenger_partnership.duo_statistics 
              : data[0].challenged_partnership.duo_statistics,
            loser: data[0].winner_partnership_id === data[0].challenger_partnership_id 
              ? data[0].challenged_partnership.duo_statistics 
              : data[0].challenger_partnership.duo_statistics
          });
        }
        
        return data;
      }

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

  // Group matches by partnership pairs for duo matches only when isDuo is true
  const groupedMatches = isDuo ? 
    matches.reduce((acc: Record<string, any[]>, match: any) => {
      if (isDuoMatch(match)) {
        // Create a unique key for each duo partnership pair, regardless of who challenged who
        const partnership1 = match.challenger_partnership_id;
        const partnership2 = match.challenged_partnership_id;
        const pairKey = [partnership1, partnership2].sort().join('-');
        
        if (!acc[pairKey]) {
          acc[pairKey] = [];
        }
        
        acc[pairKey].push(match);
      }
      return acc;
    }, {}) : null;

  return (
    <div className="space-y-6">
      {isDuo && groupedMatches ? (
        // Display matches grouped by partnership pairs for duo matches
        Object.entries(groupedMatches).map(([pairKey, pairMatches]: [string, any[]]) => {
          // Get the most recent match to display as the main one
          const latestMatch = pairMatches.sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0];
          
          const winnerPartnership = latestMatch.winner_partnership_id === latestMatch.challenger_partnership.id
            ? latestMatch.challenger_partnership
            : latestMatch.challenged_partnership;
            
          const loserPartnership = latestMatch.winner_partnership_id === latestMatch.challenger_partnership.id
            ? latestMatch.challenged_partnership
            : latestMatch.challenger_partnership;
            
          // Get the statistics
          const winnerStats = winnerPartnership.duo_statistics[0] || { points: 0, wins: 0, losses: 0 };
          const loserStats = loserPartnership.duo_statistics[0] || { points: 0, wins: 0, losses: 0 };
          
          // Calculate head-to-head record for these partnerships
          const h2hRecord = pairMatches.reduce(
            (record, match) => {
              const isFirstPartnershipWinner = match.winner_partnership_id === pairMatches[0].challenger_partnership.id;
              if (isFirstPartnershipWinner) {
                record.firstWins++;
              } else {
                record.secondWins++;
              }
              return record;
            },
            { firstWins: 0, secondWins: 0 }
          );
          
          // Determine which partnership is first in our grouping
          const isWinnerFirstInGroup = winnerPartnership.id === pairMatches[0].challenger_partnership.id;
          const winnerH2HWins = isWinnerFirstInGroup ? h2hRecord.firstWins : h2hRecord.secondWins;
          const loserH2HWins = isWinnerFirstInGroup ? h2hRecord.secondWins : h2hRecord.firstWins;

          return (
            <div 
              key={pairKey}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex -space-x-2">
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-green-500">
                      <AvatarImage src={winnerPartnership.player1.avatar_url} />
                      <AvatarFallback>{winnerPartnership.player1.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-green-500">
                      <AvatarImage src={winnerPartnership.player2.avatar_url} />
                      <AvatarFallback>{winnerPartnership.player2.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-green-600 truncate">
                      {winnerPartnership.player1.full_name} & {winnerPartnership.player2.full_name}
                      <Trophy className="h-4 w-4 inline ml-1 text-yellow-500" />
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-green-700">{latestMatch.winner_score}</p>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                        <Star className="h-3 w-3 mr-1" />
                        {winnerStats.points} pts (W: {winnerStats.wins}, L: {winnerStats.losses})
                      </Badge>
                    </div>
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
                        {winnerH2HWins} - {loserH2HWins}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Head-to-head record</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="min-w-0 text-right">
                    <p className="font-medium text-gray-600 truncate">
                      {loserPartnership.player1.full_name} & {loserPartnership.player2.full_name}
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-sm text-gray-700">{latestMatch.loser_score}</p>
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                        <Star className="h-3 w-3 mr-1" />
                        {loserStats.points} pts (W: {loserStats.wins}, L: {loserStats.losses})
                      </Badge>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-200">
                      <AvatarImage src={loserPartnership.player1.avatar_url} />
                      <AvatarFallback>{loserPartnership.player1.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-200">
                      <AvatarImage src={loserPartnership.player2.avatar_url} />
                      <AvatarFallback>{loserPartnership.player2.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {format(new Date(latestMatch.updated_at), 'MMM d, yyyy')}
                </div>
                
                {pairMatches.length > 1 && (
                  <Badge variant="outline" className="text-xs">
                    {pairMatches.length} matches played
                  </Badge>
                )}
              </div>
              
              {/* History of matches between these partnerships */}
              {pairMatches.length > 1 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-1">Match History</p>
                  <div className="space-y-1">
                    {pairMatches.slice(0, 3).map((match, idx) => {
                      if (idx === 0) return null; // Skip the latest match as it's already displayed
                      
                      const matchWinnerPartnership = match.winner_partnership_id === match.challenger_partnership.id
                        ? match.challenger_partnership
                        : match.challenged_partnership;
                      
                      return (
                        <div key={match.id} className="text-xs flex justify-between items-center">
                          <span className="text-gray-600">
                            {matchWinnerPartnership.player1.full_name} & {matchWinnerPartnership.player2.full_name} won
                          </span>
                          <span className="text-gray-500">
                            {match.winner_score} - {match.loser_score} ({format(new Date(match.updated_at), 'MMM d')})
                          </span>
                        </div>
                      );
                    })}
                    
                    {pairMatches.length > 4 && (
                      <div className="text-xs text-gray-400 text-center">
                        + {pairMatches.length - 4} more matches
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        // Regular display for non-duo matches
        matches.map((match) => {
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
        })
      )}
    </div>
  );
};
