import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          challenger:challenger_id(username, full_name, avatar_url),
          challenged:challenged_id(username, full_name, avatar_url)
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
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-gray-500">Loading matches...</div>
      </div>
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
    <div className="space-y-4">
      {matches.map((match) => (
        <div 
          key={match.id} 
          className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={match.challenger?.avatar_url} />
              <AvatarFallback>{match.challenger?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{match.challenger?.full_name}</span>
            <span className="text-muted-foreground">vs</span>
            <Avatar className="h-10 w-10">
              <AvatarImage src={match.challenged?.avatar_url} />
              <AvatarFallback>{match.challenged?.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{match.challenged?.full_name}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(match.proposed_time), 'MMM d, h:mm a')}
          </div>
        </div>
      ))}
    </div>
  );
};