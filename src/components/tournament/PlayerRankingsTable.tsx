import { Table, TableBody } from "@/components/ui/table";
import { UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Player } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { RankingTableHeader } from "./rankings/RankingTableHeader";
import { RankingTableRow } from "./rankings/RankingTableRow";
import { MobileRankingCard } from "./rankings/MobileRankingCard";

interface PlayerRankingsTableProps {
  leagueId: string;
}

export const PlayerRankingsTable = ({ leagueId }: PlayerRankingsTableProps) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
      }
    };
    checkUser();
  }, []);

  const { data: players, isLoading } = useQuery({
    queryKey: ['player-rankings', leagueId],
    queryFn: async () => {
      const { data: playerStats, error } = await supabase
        .from('player_statistics')
        .select(`
          *,
          profiles:player_id (
            full_name,
            avatar_url
          )
        `)
        .eq('league_id', leagueId)
        .order('rank', { ascending: true });

      if (error) throw error;

      return playerStats.map(stat => ({
        id: stat.player_id,
        name: stat.profiles?.full_name || 'Unknown Player',
        avatar_url: stat.profiles?.avatar_url,
        rank: stat.rank,
        wins: stat.wins,
        losses: stat.losses,
        points: stat.points,
        achievements: stat.points > 100 ? [
          { title: "High Scorer", icon: UserRound }
        ] : undefined
      }));
    },
    refetchInterval: 5000 // Refresh every 5 seconds to keep rankings current
  });

  const handleChallenge = (playerId: string, playerName: string) => {
    navigate(`/player-challenge/${playerId}`, {
      state: { 
        playerName,
        leagueId,
        fromTournament: true
      }
    });
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 via-yellow-100/50 to-amber-50 font-semibold text-yellow-700 hover:from-yellow-100 hover:to-amber-100/50";
      case 2:
        return "bg-gradient-to-r from-gray-50 via-slate-100/50 to-gray-50 font-semibold text-gray-700 hover:from-gray-100 hover:to-slate-100/50";
      case 3:
        return "bg-gradient-to-r from-amber-50 via-orange-100/50 to-amber-50 font-semibold text-amber-800 hover:from-amber-100 hover:to-orange-100/50";
      default:
        return "hover:bg-gray-50/50 transition-colors duration-200";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 shadow-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
            <UserRound className="h-12 w-12 text-muted animate-pulse" />
            <p>Loading rankings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!players || players.length === 0) {
    return (
      <Card className="bg-white/80 shadow-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
            <UserRound className="h-12 w-12 text-muted animate-pulse" />
            <p>No player rankings available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-blue-100/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            {players.map((player) => (
              <MobileRankingCard
                key={player.id}
                player={player}
                currentUserId={currentUserId}
                onChallenge={handleChallenge}
                getRankStyle={getRankStyle}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-blue-100/50">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <RankingTableHeader />
            <TableBody>
              {players.map((player) => (
                <RankingTableRow
                  key={player.id}
                  player={player}
                  currentUserId={currentUserId}
                  onChallenge={handleChallenge}
                  getRankStyle={getRankStyle}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};