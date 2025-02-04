import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Medal, Swords } from "lucide-react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";
import { Tables } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TournamentStatsProps {
  leagueId: string;
  isDuo?: boolean;
}

export const TournamentStats = ({ leagueId, isDuo }: TournamentStatsProps) => {
  const { data: playerStats, isLoading } = useQuery({
    queryKey: ['player-statistics', leagueId, isDuo],
    queryFn: async () => {
      if (isDuo) {
        const { data, error } = await supabase
          .from('duo_league_participants')
          .select(`
            *,
            duo_partnership:duo_partnerships (
              id,
              player1:profiles!duo_partnerships_player1_id_fkey (username, avatar_url),
              player2:profiles!duo_partnerships_player2_id_fkey (username, avatar_url),
              duo_statistics (
                wins,
                losses
              )
            )
          `)
          .eq('league_id', leagueId);

        if (error) throw error;

        // Transform the data to match the expected format
        return data.map((participant) => ({
          duo_partnership_id: participant.duo_partnership.id,
          player1: participant.duo_partnership.player1,
          player2: participant.duo_partnership.player2,
          wins: participant.duo_partnership.duo_statistics?.[0]?.wins || 0,
          losses: participant.duo_partnership.duo_statistics?.[0]?.losses || 0,
          rank: 0, // Will be calculated based on wins/losses
          points: (participant.duo_partnership.duo_statistics?.[0]?.wins || 0) * 10
        }));
      }

      const { data, error } = await supabase
        .from('player_statistics')
        .select(`
          *,
          profiles (username, avatar_url)
        `)
        .eq('league_id', leagueId)
        .order('rank', { ascending: true });

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  if (!playerStats && !isLoading) {
    return (
      <Card className="mt-6 bg-gradient-to-br from-gray-50 to-white/80 shadow-lg">
        <CardContent className="p-6">
          <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
            <AlertDescription className="text-blue-600">
              No player statistics available for this tournament.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mt-6 bg-gradient-to-br from-gray-50 to-white/80 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-gray-500">
              <Trophy className="h-8 w-8 animate-bounce text-blue-500 mb-2" />
              <span className="text-sm font-medium">Loading rankings...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 overflow-hidden bg-gradient-to-br from-white to-gray-50/80 shadow-xl transform transition-all duration-300 hover:shadow-2xl">
      <CardHeader className="relative overflow-hidden border-b border-blue-100">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-500/10 to-purple-600/5 animate-pulse-soft" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-purple-100/10 to-transparent" />
        <CardTitle className="relative flex items-center gap-3 text-lg font-bold">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md transform transition-transform duration-300 hover:scale-110">
              <Trophy className="h-5 w-5 animate-pulse-soft" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent font-extrabold text-xl">
              Tournament Rankings
            </span>
            <span className="text-sm text-gray-500 font-normal">
              Track your progress and compete with others
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        <Tabs defaultValue="points" className="w-full">
          <TabsList className="w-full justify-start bg-background/50 border-b p-0 h-12">
            <TabsTrigger 
              value="points" 
              className="flex-1 data-[state=active]:bg-background rounded-none border-r h-full"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Points Ranking
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="flex-1 data-[state=active]:bg-background rounded-none h-full"
            >
              <Swords className="h-4 w-4 mr-2" />
              Matches Played
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="points" className="mt-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-purple-50/30 pointer-events-none" />
              <PlayerRankingsTable 
                leagueId={leagueId} 
                sortBy="points"
                playerStats={playerStats}
                isDuo={isDuo}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="matches" className="mt-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-50/30 to-emerald-50/30 pointer-events-none" />
              <PlayerRankingsTable 
                leagueId={leagueId}
                sortBy="matches"
                playerStats={playerStats}
                isDuo={isDuo}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
