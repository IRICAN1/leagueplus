
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRankingsData } from "./hooks/useRankingsData";
import { RankingsLoader } from "./components/RankingsLoader";
import { RankingTabs } from "./components/RankingTabs";
import { RankingTabContent } from "./components/RankingTabContent";

interface LeagueGlobalRankingsProps {
  leagueId: string;
}

export const LeagueGlobalRankings = ({ leagueId }: LeagueGlobalRankingsProps) => {
  const isMobile = useIsMobile();
  const { data: rankings, isLoading } = useRankingsData(leagueId);

  const hasRankings = rankings && Object.values(rankings).some(list => list.length > 0);

  return (
    <Tabs defaultValue="points">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
          <RankingTabs />
          <CardTitle className="text-lg mt-2">League Rankings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RankingsLoader isLoading={isLoading} hasData={!!hasRankings} />
          
          {hasRankings && (
            <>
              <RankingTabContent 
                value="points"
                players={rankings.byPoints}
                allPlayers={rankings.all}
              />
              <RankingTabContent 
                value="matches"
                players={rankings.byMatches}
                allPlayers={rankings.all}
              />
              <RankingTabContent 
                value="winrate"
                players={rankings.byWinRate}
                allPlayers={rankings.all}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
};
