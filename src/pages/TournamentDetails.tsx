import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { TournamentHeader } from "@/components/tournament/TournamentHeader";
import { PlayerRankingsTable } from "@/components/tournament/PlayerRankingsTable";
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

  const { data: playerStats, isLoading: isLoadingStats, error } = useQuery({
    queryKey: ['playerStats', id],
    queryFn: async () => {
      // Validate if id is a valid UUID
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

  const tournament = {
    title: "Tennis Tournament 2024",
    location: "Tennis Club Paris",
    date: "January 15, 2024",
    description: "Join our prestigious tennis tournament and compete against the best players in the region.",
    players: [
      {
        id: 1,
        name: "John Doe",
        rank: 1,
        wins: 15,
        losses: 3,
        points: 1500,
        achievements: [
          { title: "Tournament Winner", icon: Trophy },
          { title: "Perfect Season", icon: Trophy },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        rank: 2,
        wins: 12,
        losses: 6,
        points: 1200,
        achievements: [
          { title: "Most Improved", icon: Trophy },
          { title: "Prize Winner", icon: Trophy },
        ],
      },
      {
        id: 3,
        name: "Michael Johnson",
        rank: 3,
        wins: 11,
        losses: 4,
        points: 1150,
        achievements: [{ title: "Rising Star", icon: Trophy }],
      },
      {
        id: 4,
        name: "Sarah Williams",
        rank: 4,
        wins: 10,
        losses: 5,
        points: 1100,
        achievements: [{ title: "Most Consistent", icon: Trophy }],
      },
      {
        id: 5,
        name: "David Brown",
        rank: 5,
        wins: 9,
        losses: 7,
        points: 1050,
        achievements: [{ title: "Comeback Player", icon: Trophy }],
      },
      {
        id: 6,
        name: "Emma Davis",
        rank: 6,
        wins: 8,
        losses: 8,
        points: 1000,
        achievements: [{ title: "Fan Favorite", icon: Trophy }],
      },
      {
        id: 7,
        name: "James Wilson",
        rank: 7,
        wins: 8,
        losses: 7,
        points: 950,
        achievements: [{ title: "Most Improved", icon: Trophy }],
      },
      {
        id: 8,
        name: "Olivia Taylor",
        rank: 8,
        wins: 7,
        losses: 9,
        points: 900,
        achievements: [{ title: "Rookie of the Year", icon: Trophy }],
      },
      {
        id: 9,
        name: "William Anderson",
        rank: 9,
        wins: 7,
        losses: 8,
        points: 850,
        achievements: [{ title: "Most Sportsman", icon: Trophy }],
      },
      {
        id: 10,
        name: "Sophie Martinez",
        rank: 10,
        wins: 6,
        losses: 10,
        points: 800,
        achievements: [{ title: "Best Server", icon: Trophy }],
      },
      {
        id: 11,
        name: "Lucas Garcia",
        rank: 11,
        wins: 6,
        losses: 9,
        points: 750,
        achievements: [{ title: "Most Determined", icon: Trophy }],
      },
      {
        id: 12,
        name: "Isabella Lopez",
        rank: 12,
        wins: 5,
        losses: 11,
        points: 700,
        achievements: [{ title: "Best Doubles", icon: Trophy }],
      },
      {
        id: 13,
        name: "Ethan Lee",
        rank: 13,
        wins: 5,
        losses: 10,
        points: 650,
        achievements: [{ title: "Most Creative", icon: Trophy }],
      },
      {
        id: 14,
        name: "Ava Rodriguez",
        rank: 14,
        wins: 4,
        losses: 12,
        points: 600,
        achievements: [{ title: "Best Backhand", icon: Trophy }],
      },
      {
        id: 15,
        name: "Noah Kim",
        rank: 15,
        wins: 4,
        losses: 11,
        points: 550,
        achievements: [{ title: "Most Resilient", icon: Trophy }],
      },
      {
        id: 16,
        name: "Mia Patel",
        rank: 16,
        wins: 3,
        losses: 13,
        points: 500,
        achievements: [{ title: "Best Forehand", icon: Trophy }],
      },
      {
        id: 17,
        name: "Alexander Chen",
        rank: 17,
        wins: 3,
        losses: 12,
        points: 450,
        achievements: [{ title: "Most Improved Serve", icon: Trophy }],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <TournamentHeader
          id={id || ''}
          tournament={tournament}
          isAuthenticated={isAuthenticated}
        />

        <Card className="bg-white/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              Player Rankings & Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center text-red-600">
                Failed to load player statistics
              </div>
            ) : isLoadingStats ? (
              <div className="text-center">Loading player statistics...</div>
            ) : (
              <PlayerRankingsTable players={tournament.players} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentDetails;
