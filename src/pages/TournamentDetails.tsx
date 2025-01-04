import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { UpcomingMatches } from "@/components/tournament/matches/UpcomingMatches";
import { MatchHistoryList } from "@/components/tournament/matches/MatchHistoryList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: league, isLoading: isLoadingLeague, error: leagueError } = useQuery({
    queryKey: ['league', id],
    queryFn: async () => {
      if (!id || !UUID_REGEX.test(id)) {
        throw new Error('Invalid league ID format');
      }

      const { data, error } = await supabase
        .from('leagues')
        .select(`
          *,
          creator:profiles!leagues_creator_id_fkey (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const { data: registeredPlayers } = useQuery({
    queryKey: ['registeredPlayers', id],
    queryFn: async () => {
      const { count } = await supabase
        .from('league_participants')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', id);
      return count || 0;
    }
  });

  const { data: isUserRegistered } = useQuery({
    queryKey: ['isUserRegistered', id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { count } = await supabase
        .from('league_participants')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', id)
        .eq('user_id', session.user.id);

      return count ? count > 0 : false;
    },
    enabled: isAuthenticated && !!id
  });

  if (!id || !UUID_REGEX.test(id)) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Invalid tournament ID format. Please check the URL.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoadingLeague) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (leagueError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading league details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>League not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {!isAuthenticated && (
        <Alert>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span>Sign in to register for this league and access all features.</span>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login', { state: { returnTo: `/tournament/${id}` } })}
              className="w-full sm:w-auto"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <TournamentHeader 
        league={league} 
        isAuthenticated={isAuthenticated}
        isUserRegistered={isUserRegistered}
        registeredPlayers={registeredPlayers}
      />

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="matches">Upcoming Matches</TabsTrigger>
          <TabsTrigger value="history">Match History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches">
          <UpcomingMatches leagueId={id} />
        </TabsContent>

        <TabsContent value="history">
          <MatchHistoryList leagueId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TournamentDetails;