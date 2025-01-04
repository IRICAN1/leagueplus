import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentBasicInfo } from "./TournamentBasicInfo";
import { TournamentStats } from "./TournamentStats";
import { TournamentMatches } from "./TournamentMatches";

interface TournamentHeaderProps {
  league: Tables<"leagues", never> & {
    creator: {
      username: string | null;
    } | null;
  };
  isAuthenticated: boolean;
}

export const TournamentHeader = ({ league, isAuthenticated }: TournamentHeaderProps) => {
  const { data: isUserRegistered } = useQuery({
    queryKey: ['isUserRegistered', league.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { count } = await supabase
        .from('league_participants')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', league.id)
        .eq('user_id', session.user.id);
      
      return count ? count > 0 : false;
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <TournamentBasicInfo 
              league={league}
              isAuthenticated={isAuthenticated}
              isUserRegistered={isUserRegistered}
            />
            <TournamentStats league={league} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="matches">Upcoming Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {league.description && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">{league.description}</p>
                  </div>
                )}
                {league.rules && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Rules</h3>
                    <p className="text-sm text-muted-foreground">{league.rules}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="matches" className="mt-6">
          <TournamentMatches leagueId={league.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};