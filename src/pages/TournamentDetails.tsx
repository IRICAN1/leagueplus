import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { TournamentStats } from "@/components/tournament/TournamentStats";
import { UpcomingMatches } from "@/components/tournament/matches/UpcomingMatches";
import { MatchHistoryList } from "@/components/tournament/matches/MatchHistoryList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { LogIn, Trophy, Calendar, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
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
          creator:creator_id (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('League not found');
      return data;
    },
    retry: 1,
    enabled: !!id && UUID_REGEX.test(id)
  });

  const { data: registeredPlayers } = useQuery({
    queryKey: ['registeredPlayers', id],
    queryFn: async () => {
      const { count } = await supabase
        .from('league_participants')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', id);
      return count || 0;
    },
    enabled: !!id
  });

  const { data: isUserRegistered } = useQuery({
    queryKey: ['isUserRegistered', id, userId],
    queryFn: async () => {
      if (!userId || !id) return false;
      
      const { data, error } = await supabase
        .from('league_participants')
        .select('id')
        .eq('league_id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!id
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
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
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
    <div className="container mx-auto p-4 space-y-6 sm:mt-0 mt-20">
      {!isAuthenticated && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>Sign in to register for this league and access all features.</span>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login', { state: { returnTo: `/tournament/${id}` } })}
              className="ml-4"
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

      <Tabs defaultValue="rankings" className="space-y-6">
        <TabsList className="w-full justify-start bg-background border rounded-lg p-1 flex flex-wrap gap-1">
          <TabsTrigger value="rankings" className="flex-1 sm:flex-none">
            <Trophy className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Rankings</span>
            <span className="sm:hidden">Rank</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex-1 sm:flex-none">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Upcoming Matches</span>
            <span className="sm:hidden">Matches</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">
            <History className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Match History</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rankings">
          <TournamentStats leagueId={id} />
        </TabsContent>
        
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