
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Medal } from "lucide-react";

interface RankingTabsProps {
  defaultValue?: string;
}

export const RankingTabs = ({ defaultValue = "points" }: RankingTabsProps) => {
  return (
    <TabsList className="w-full justify-start bg-white/50 rounded-lg p-1">
      <TabsTrigger value="points">
        <Trophy className="h-4 w-4 mr-2" />
        <span>By Points</span>
      </TabsTrigger>
      <TabsTrigger value="matches">
        <Users className="h-4 w-4 mr-2" />
        <span>By Matches</span>
      </TabsTrigger>
      <TabsTrigger value="winrate">
        <Medal className="h-4 w-4 mr-2" />
        <span>By Win Rate</span>
      </TabsTrigger>
    </TabsList>
  );
};
