
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TournamentStats } from "@/components/tournament/TournamentStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DuoTournamentAlert } from "@/components/tournament/duo/DuoTournamentAlert";
import { DuoTournamentHeader } from "@/components/tournament/duo/DuoTournamentHeader";
import { DuoTournamentTabs } from "@/components/tournament/duo/DuoTournamentTabs";

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
          duo_partnership:duo_partnerships!inner (
            id,
            player1:profiles!duo_partnerships_player1_id_fkey (
              id,
              username,
              avatar_url
            ),
            player2:profiles!duo_partnerships_player2_id_fkey (
              id,
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
    avatar_url2: participant.duo_partnership.player2?.avatar_url,
    rank: index + 1,
    wins: participant.duo_partnership.duo_statistics[0]?.wins || 0,
    losses: participant.duo_partnership.duo_statistics[0]?.losses || 0,
    matches_played: (participant.duo_partnership.duo_statistics[0]?.wins || 0) + 
                   (participant.duo_partnership.duo_statistics[0]?.losses || 0)
  })) || [];

  return (
    <div className="container mx-auto p-4 space-y-6 sm:mt-0 mt-20">
      {!isAuthenticated && <DuoTournamentAlert tournamentId={id} />}
      
      <div className="flex flex-col gap-4">
        <DuoTournamentHeader
          name={league.name}
          creatorName={league.creator?.full_name || league.creator?.username}
          isAuthenticated={isAuthenticated}
          isUserRegistered={isUserRegistered}
          onRegisterClick={handleRegisterClick}
        />
        
        <TournamentStats leagueId={id} isDuo={true} />

        <DuoTournamentTabs 
          leagueId={id}
          processedRankings={processedRankings}
        />
      </div>
    </div>
  );
};

export default DuoTournamentDetails;

