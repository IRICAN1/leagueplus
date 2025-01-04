import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface UpcomingMatchesProps {
  leagueId: string;
}

export const UpcomingMatches = ({ leagueId }: UpcomingMatchesProps) => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['upcoming-matches', leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('match_challenges')
        .select(`
          *,
          challenger:challenger_id (
            username,
            avatar_url
          ),
          challenged:challenged_id (
            username,
            avatar_url
          )
        `)
        .eq('league_id', leagueId)
        .eq('status', 'accepted')
        .gt('proposed_time', new Date().toISOString())
        .order('proposed_time', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">Loading matches...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matches?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No upcoming matches scheduled
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-purple-600" />
          Upcoming Matches
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {matches.map((match) => (
            <div 
              key={match.id} 
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={match.challenger?.avatar_url || ''} />
                  <AvatarFallback>{match.challenger?.username?.[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{match.challenger?.username}</span>
                <span className="text-muted-foreground">vs</span>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={match.challenged?.avatar_url || ''} />
                  <AvatarFallback>{match.challenged?.username?.[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{match.challenged?.username}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(match.proposed_time), 'MMM d, h:mm a')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};