import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { TournamentStats } from "@/components/tournament/TournamentStats";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const TournamentDetails = () => {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  const { data: league, isLoading: isLoadingLeague } = useQuery({
    queryKey: ['league', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('League not found');
      return data;
    },
    meta: {
      errorMessage: 'Failed to load league details'
    }
  });

  const { data: playerStats, isLoading: isLoadingStats, error } = useQuery({
    queryKey: ['playerStats', id],
    queryFn: async () => {
      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!id || !UUID_REGEX.test(id)) {
        throw new Error('Invalid league ID format');
      }

      const { data, error } = await supabase
        .from('player_statistics')
        .select(`
          *,
          profiles:player_id (username)
        `)
        .eq('league_id', id)
        .order('rank', { ascending: true });

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: 'Failed to load player statistics'
    }
  });

  useEffect(() => {
    if (error) {
      toast.error('Failed to load player statistics');
    }
  }, [error]);

  if (isLoadingLeague) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        Loading tournament details...
      </div>
    </div>;
  }

  if (!league) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        Tournament not found
      </div>
    </div>;
  }

  const tournamentData = {
    title: league.name,
    location: league.location,
    date: new Date(league.start_date).toLocaleDateString(),
    description: league.description || 'No description available',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <TournamentHeader
          id={id || ''}
          tournament={tournamentData}
          isAuthenticated={isAuthenticated}
        />
        <TournamentStats 
          playerStats={playerStats || []}
          isLoading={isLoadingStats}
        />
      </div>
    </div>
  );
};

export default TournamentDetails;