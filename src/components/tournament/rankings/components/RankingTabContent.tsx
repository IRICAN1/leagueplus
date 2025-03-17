
import { TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileRankingsList } from "./MobileRankingsList";
import { DesktopRankingsTable } from "./DesktopRankingsTable";

interface RankingTabContentProps {
  value: 'points' | 'matches' | 'winrate';
  players: any[];
  allPlayers: any[];
}

export const RankingTabContent = ({ value, players, allPlayers }: RankingTabContentProps) => {
  const isMobile = useIsMobile();
  
  // For winrate, only show players with matches
  const displayPlayers = value === 'winrate' ? players : allPlayers;
  
  return (
    <TabsContent value={value} className="m-0">
      {isMobile ? (
        <MobileRankingsList players={displayPlayers} sortType={value} />
      ) : (
        <DesktopRankingsTable players={displayPlayers} sortType={value} />
      )}
    </TabsContent>
  );
};
