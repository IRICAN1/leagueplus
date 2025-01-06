import { Table, TableBody } from "@/components/ui/table";
import { UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Player } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { RankingTableHeader } from "./rankings/RankingTableHeader";
import { RankingTableRow } from "./rankings/RankingTableRow";
import { MobileRankingCard } from "./rankings/MobileRankingCard";
import { useQuery } from "@tanstack/react-query";

interface PlayerRankingsTableProps {
  leagueId: string;
  sortBy: "points" | "matches";
  playerStats?: any[];
  isDoubles?: boolean;
}

export const PlayerRankingsTable = ({ leagueId, sortBy, playerStats, isDoubles }: PlayerRankingsTableProps) => {
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

  // Fetch league details to check if it requires duos
  const { data: league } = useQuery({
    queryKey: ['league', leagueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: players } = useQuery({
    queryKey: ['player-rankings', leagueId, sortBy, playerStats],
    queryFn: async () => {
      if (playerStats) {
        const mappedStats = playerStats.map((stat, index) => ({
          id: stat.player_id,
          name: stat.profiles?.username || 'Unknown Player',
          avatar_url: stat.profiles?.avatar_url,
          rank: sortBy === 'points' ? stat.rank : index + 1,
          wins: stat.wins || 0,
          losses: stat.losses || 0,
          points: stat.points || 0,
          matches_played: (stat.wins || 0) + (stat.losses || 0),
          achievements: getPlayerAchievements(stat)
        }));

        if (sortBy === 'matches') {
          mappedStats.sort((a, b) => b.matches_played - a.matches_played);
          mappedStats.forEach((player, index) => {
            player.rank = index + 1;
          });
        }

        return mappedStats;
      }
      return [];
    },
    enabled: !!playerStats,
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

  const getRankStyle = (rank: number, sortBy: "points" | "matches") => {
    const baseStyles = {
      points: {
        1: "bg-gradient-to-r from-yellow-50 via-yellow-100/50 to-amber-50 font-semibold text-yellow-700 hover:from-yellow-100 hover:to-amber-100/50",
        2: "bg-gradient-to-r from-gray-50 via-slate-100/50 to-gray-50 font-semibold text-gray-700 hover:from-gray-100 hover:to-slate-100/50",
        3: "bg-gradient-to-r from-amber-50 via-orange-100/50 to-amber-50 font-semibold text-amber-800 hover:from-amber-100 hover:to-orange-100/50"
      },
      matches: {
        1: "bg-gradient-to-r from-emerald-50 via-green-100/50 to-emerald-50 font-semibold text-emerald-700 hover:from-emerald-100 hover:to-green-100/50",
        2: "bg-gradient-to-r from-teal-50 via-emerald-100/50 to-teal-50 font-semibold text-teal-700 hover:from-teal-100 hover:to-emerald-100/50",
        3: "bg-gradient-to-r from-green-50 via-teal-100/50 to-green-50 font-semibold text-green-800 hover:from-green-100 hover:to-teal-100/50"
      }
    };

    return rank <= 3 ? baseStyles[sortBy][rank as keyof typeof baseStyles.points] : "hover:bg-gray-50/50 transition-colors duration-200";
  };

  const getPlayerAchievements = (stat: any) => {
    const achievements = [];
    const totalMatches = (stat.wins || 0) + (stat.losses || 0);
    if (totalMatches >= 20) achievements.push({ title: "Veteran", icon: UserRound });
    if (totalMatches >= 10) achievements.push({ title: "Regular", icon: UserRound });
    if (stat.points > 100) achievements.push({ title: "High Scorer", icon: UserRound });
    return achievements;
  };

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

  const requiresDuo = league?.requires_duo || isDoubles;

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
                getRankStyle={(rank) => getRankStyle(rank, sortBy)}
                sortBy={sortBy}
                requiresDuo={requiresDuo}
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
            <RankingTableHeader sortBy={sortBy} requiresDuo={requiresDuo} />
            <TableBody>
              {players.map((player) => (
                <RankingTableRow
                  key={player.id}
                  player={player}
                  currentUserId={currentUserId}
                  onChallenge={handleChallenge}
                  getRankStyle={(rank) => getRankStyle(rank, sortBy)}
                  sortBy={sortBy}
                  isDoubles={requiresDuo}
                  leagueId={leagueId}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};