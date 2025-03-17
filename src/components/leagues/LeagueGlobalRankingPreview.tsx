
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Medal, Trophy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface LeagueGlobalRankingPreviewProps {
  leagueId: string;
  leagueType: 'duo' | 'individual';
}

export const LeagueGlobalRankingPreview = ({ leagueId, leagueType }: LeagueGlobalRankingPreviewProps) => {
  const isMobile = useIsMobile();

  const { data: rankings, isLoading } = useQuery({
    queryKey: ['preview-global-rankings', leagueId],
    queryFn: async () => {
      if (leagueType !== 'duo') {
        return { byPoints: [] }; // Only handling duo leagues for now
      }
      
      const { data, error } = await supabase
        .from('duo_league_participants')
        .select(`
          duo_partnership:duo_partnerships!inner (
            id,
            player1:profiles!duo_partnerships_player1_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              primary_location,
              skill_level,
              gender
            ),
            player2:profiles!duo_partnerships_player2_id_fkey (
              id,
              username,
              full_name,
              avatar_url,
              primary_location,
              skill_level,
              gender
            )
          )
        `)
        .eq('league_id', leagueId);

      if (error) throw error;
      
      // Get all partnership IDs to fetch stats
      const partnershipIds = data.map(item => item.duo_partnership.id);
      
      // Fetch all statistics in a separate query
      const { data: statsData, error: statsError } = await supabase
        .from('duo_statistics')
        .select('*')
        .in('partnership_id', partnershipIds);
        
      if (statsError) throw statsError;
      
      // Create a map for easy lookup
      const statsMap = new Map();
      statsData?.forEach(stat => {
        statsMap.set(stat.partnership_id, stat);
      });
      
      const processedData = data.map(item => {
        const partnership = item.duo_partnership;
        // Look up stats or use default values
        const stats = statsMap.get(partnership.id) || { 
          wins: 0, 
          losses: 0, 
          points: 0, 
          rank: 999999 
        };
        
        return {
          id: partnership.id,
          player1: {
            id: partnership.player1.id,
            name: partnership.player1.full_name || partnership.player1.username || 'Unknown',
            avatar: partnership.player1.avatar_url,
            location: partnership.player1.primary_location
          },
          player2: {
            id: partnership.player2.id,
            name: partnership.player2.full_name || partnership.player2.username || 'Unknown',
            avatar: partnership.player2.avatar_url,
            location: partnership.player2.primary_location
          },
          stats: {
            rank: stats.rank || 999999,
            wins: stats.wins || 0,
            losses: stats.losses || 0,
            points: stats.points || 0,
            matchesPlayed: (stats.wins || 0) + (stats.losses || 0),
            winRate: (stats.wins || 0) + (stats.losses || 0) > 0 
              ? Math.round((stats.wins || 0) / ((stats.wins || 0) + (stats.losses || 0)) * 100) 
              : 0
          }
        };
      });
      
      // Sort by points and limit to top 5
      const pointsSorted = [...processedData]
        .sort((a, b) => b.stats.points - a.stats.points || a.stats.rank - b.stats.rank)
        .slice(0, 5);
      
      return {
        byPoints: pointsSorted
      };
    }
  });

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100">
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (!rankings || rankings.byPoints.length === 0) {
    return null; // Don't show anything if no rankings
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Top Rankings</CardTitle>
          <Link 
            to={leagueType === 'duo' ? `/duo-tournament/${leagueId}` : `/tournament/${leagueId}`}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {renderRankingTable(rankings.byPoints)}
      </CardContent>
    </Card>
  );

  function renderRankingTable(players: any[]) {
    if (isMobile) {
      return (
        <div className="p-3 space-y-3">
          {players.map((player, index) => (
            <Card key={player.id} className="overflow-hidden shadow-sm">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-white text-blue-600 font-bold">
                    #{player.stats.rank === 999999 ? '-' : player.stats.rank}
                  </Badge>
                  <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={player.player1.avatar} />
                      <AvatarFallback>{player.player1.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={player.player2.avatar} />
                      <AvatarFallback>{player.player2.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {player.stats.points} pts
                </Badge>
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold mb-1">
                  {player.player1.name} & {player.player2.name}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>{player.player1.location || 'Unknown location'}</div>
                  <div>
                    <span className="text-green-600 font-medium">{player.stats.wins}</span>
                    <span className="mx-1">/</span>
                    <span className="text-red-600 font-medium">{player.stats.losses}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Location</TableHead>
            <TableHead className="text-right">W/L</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player.id} className={index < 3 ? 'bg-blue-50/30' : ''}>
              <TableCell className="font-medium">
                {player.stats.rank <= 3 ? (
                  player.stats.rank === 1 ? (
                    <Trophy className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                  ) : player.stats.rank === 2 ? (
                    <Medal className="h-5 w-5 text-gray-500 inline-block mr-1" />
                  ) : (
                    <Medal className="h-5 w-5 text-amber-500 inline-block mr-1" />
                  )
                ) : null}
                #{player.stats.rank === 999999 ? '-' : player.stats.rank}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={player.player1.avatar} />
                      <AvatarFallback>{player.player1.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={player.player2.avatar} />
                      <AvatarFallback>{player.player2.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="font-medium">{player.player1.name} & {player.player2.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {player.player1.location || 'Unknown location'}
              </TableCell>
              <TableCell className="text-right">
                <span className="text-green-600 font-medium">{player.stats.wins}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span className="text-red-600 font-medium">{player.stats.losses}</span>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                  {player.stats.points}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
};
