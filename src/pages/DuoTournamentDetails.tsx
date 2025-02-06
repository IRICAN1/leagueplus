import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TournamentStats } from "@/components/tournament/TournamentStats";
import { UpcomingMatches } from "@/components/tournament/matches/UpcomingMatches";
import { MatchHistoryList } from "@/components/tournament/matches/MatchHistoryList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { LogIn, Trophy, Calendar, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PlayerRankingsTable } from "@/components/tournament/PlayerRankingsTable";

const DuoTournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

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

  // Query for duo league data
  const { data: league, isLoading: isLoadingLeague, error: leagueError } = useQuery({
    queryKey: ['duo-league', id],
    queryFn: async () => {
      if (!id) throw new Error('Invalid league ID');

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
        .single();

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
    retry: 1
  });

  // Query for duo rankings
  const { data: duoRankings } = useQuery({
    queryKey: ['duo-rankings', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('duo_league_participants')
        .select(`
          duo_partnership:duo_partnerships (
            id,
            player1:profiles!duo_partnerships_player1_id_fkey (
              username,
              avatar_url
            ),
            player2:profiles!duo_partnerships_player2_id_fkey (
              username,
              avatar_url
            ),
            duo_statistics (
              wins,
              losses
            )
          )
        `)
        .eq('league_id', id);

      if (error) throw error;
      return data;
    },
    enabled: !!id
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
          <AlertDescription>Invalid tournament ID format.</AlertDescription>
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
          <AlertDescription>Error loading league details.</AlertDescription>
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

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/duo-tournament/${id}` } });
      return;
    }
    navigate(`/duo-tournament/${id}/register`);
  };

  // Convert duo rankings data to the format expected by PlayerRankingsTable
  const processedRankings = duoRankings?.map((participant, index) => ({
    id: participant.duo_partnership.id,
    name: `${participant.duo_partnership.player1?.username || 'Unknown'} & ${participant.duo_partnership.player2?.username || 'Unknown'}`,
    avatar_url: participant.duo_partnership.player1?.avatar_url,
    rank: index + 1,
    wins: participant.duo_partnership.duo_statistics[0]?.wins || 0,
    losses: participant.duo_partnership.duo_statistics[0]?.losses || 0,
    points: (participant.duo_partnership.duo_statistics[0]?.wins || 0) * 10,
    matches_played: (participant.duo_partnership.duo_statistics[0]?.wins || 0) + 
                   (participant.duo_partnership.duo_statistics[0]?.losses || 0)
  }));

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
      
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            {league.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Created by {league.creator?.full_name || league.creator?.username || 'Unknown'}
          </p>
        </div>
        
        <TournamentStats leagueId={id} isDuo={true} />

        <div className="w-full flex flex-wrap gap-2">
          {isAuthenticated && !isUserRegistered && (
            <Button 
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              onClick={handleRegisterClick}
            >
              Register Now
            </Button>
          )}
        </div>

        <Tabs defaultValue="rankings" className="space-y-6">
          <TabsList className="w-full justify-start bg-background border rounded-lg p-1">
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
            <PlayerRankingsTable
              leagueId={id}
              sortBy="points"
              playerStats={processedRankings}
              isDuo={true}
            />
          </TabsContent>

          <TabsContent value="matches">
            <UpcomingMatches leagueId={id} />
          </TabsContent>

          <TabsContent value="history">
            <MatchHistoryList leagueId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DuoTournamentDetails;
