import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TournamentMatchesProps {
  leagueId: string;
}

export const TournamentMatches = ({ leagueId }: TournamentMatchesProps) => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['upcomingMatches', leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_challenges')
        .select(`
          *,
          challenger:challenger_id (username, avatar_url),
          challenged:challenged_id (username, avatar_url)
        `)
        .eq('league_id', leagueId)
        .eq('status', 'accepted')
        .is('winner_id', null)
        .order('proposed_time', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading matches...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming matches scheduled</p>
          ) : (
            matches?.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={match.challenger?.avatar_url || undefined} />
                    <AvatarFallback>{match.challenger?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <span>vs</span>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={match.challenged?.avatar_url || undefined} />
                    <AvatarFallback>{match.challenged?.username?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {format(new Date(match.proposed_time), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(match.proposed_time), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};