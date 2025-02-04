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
import { toast } from "sonner";

const DuoTournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCheckingLeagueType, setIsCheckingLeagueType] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check authentication status
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

  // Handle regular league redirect
  useEffect(() => {
    const checkLeagueType = async () => {
      if (!id) return;

      try {
        const { data } = await supabase
          .from('leagues')
          .select('id')
          .eq('id', id)
          .maybeSingle();

        if (data) {
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error('Error checking league type:', error);
      } finally {
        setIsCheckingLeagueType(false);
      }
    };

    checkLeagueType();
  }, [id]);

  // Handle redirect effect separately
  useEffect(() => {
    if (shouldRedirect) {
      toast.info("Redirecting to regular tournament page");
      navigate(`/tournament/${id}`, { replace: true });
    }
  }, [shouldRedirect, id, navigate]);

  // Query for duo league data
  const { data: league, isLoading: isLoadingLeague, error: leagueError } = useQuery({
    queryKey: ['duo-league', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Invalid league ID');
      }

      const { data, error } = await supabase
        .from('duo_leagues')
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

      return {
        ...data,
        format: 'Team' as const,
        is_doubles: true,
        max_participants: data.max_duo_pairs * 2,
        requires_duo: true
      };
    },
    retry: 1,
    enabled: !!id && !isCheckingLeagueType
  });

  // Check if user is registered
  const { data: isUserRegistered } = useQuery({
    queryKey: ['isUserRegisteredDuo', id, userId],
    queryFn: async () => {
      if (!userId || !id) return false;
      
      const { data, error } = await supabase
        .from('duo_league_participants')
        .select('id')
        .eq('league_id', id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!userId && !!id
  });

  if (!id) {
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

  if (isLoadingLeague || isCheckingLeagueType) {
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
              onClick={() => navigate('/login', { state: { returnTo: `/duo-tournament/${id}` } })}
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
        registeredPlayers={league.max_duo_pairs * 2}
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

export default DuoTournamentDetails;