import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { TournamentStats } from "@/components/tournament/TournamentStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!id || !UUID_REGEX.test(id)) {
        throw new Error('Invalid league ID format');
      }

      const { data, error } = await supabase
        .from('leagues')
        .select(`
          *,
          creator:creator_id (
            username
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: playerStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['player_statistics', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_statistics')
        .select(`
          *,
          profiles (username)
        `)
        .eq('league_id', id)
        .order('rank', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

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
    <div className="container mx-auto p-4 space-y-6">
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
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <TournamentHeader 
              league={league} 
              isAuthenticated={isAuthenticated}
            />
          </CardContent>
        </Card>
        <TournamentStats 
          playerStats={playerStats}
          isLoading={isLoadingStats}
        />
      </div>
    </div>
  );
};

export default TournamentDetails;