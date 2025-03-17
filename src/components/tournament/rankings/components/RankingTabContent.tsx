
import { TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileRankingsList } from "./MobileRankingsList";
import { DesktopRankingsTable } from "./DesktopRankingsTable";

interface RankingTabContentProps {
  value: 'points' | 'matches' | 'winrate' | 'global';
  players: any[];
  allPlayers: any[];
  globalDuos?: any[];
}

export const RankingTabContent = ({ 
  value, 
  players, 
  allPlayers,
  globalDuos
}: RankingTabContentProps) => {
  const isMobile = useIsMobile();
  
  // If it's the global tab, use globalDuos
  // For winrate, only show players with matches
  // For other tabs, show all players
  let displayPlayers = value === 'global' 
    ? globalDuos || []
    : value === 'winrate' 
      ? players 
      : allPlayers;
  
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
