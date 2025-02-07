
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, History, Users } from "lucide-react";
import { PlayerRankingsTable } from "@/components/tournament/PlayerRankingsTable";
import { UpcomingMatches } from "@/components/tournament/matches/UpcomingMatches";
import { MatchHistoryList } from "@/components/tournament/matches/MatchHistoryList";
import { TournamentPlayersList } from "@/components/tournament/TournamentPlayersList";

interface DuoTournamentTabsProps {
  leagueId: string;
  processedRankings: any[];
}

export const DuoTournamentTabs = ({ leagueId, processedRankings }: DuoTournamentTabsProps) => {
  return (
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
        <TabsTrigger value="players" className="flex-1 sm:flex-none">
          <Users className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Players</span>
          <span className="sm:hidden">Players</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="rankings">
        <PlayerRankingsTable
          leagueId={leagueId}
          sortBy="points"
          playerStats={processedRankings}
          isDuo={true}
        />
      </TabsContent>

      <TabsContent value="matches">
        <UpcomingMatches leagueId={leagueId} />
      </TabsContent>

      <TabsContent value="history">
        <MatchHistoryList leagueId={leagueId} />
      </TabsContent>

      <TabsContent value="players">
        <TournamentPlayersList leagueId={leagueId} isDuo={true} />
      </TabsContent>
    </Tabs>
  );
};
