
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Medal, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingTabsProps {
  defaultValue?: string;
  className?: string;
}

export const RankingTabs = ({ defaultValue = "points", className }: RankingTabsProps) => {
  return (
    <TabsList className={cn("w-full justify-start bg-white/50 rounded-lg p-1", className)}>
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
      <TabsTrigger value="global">
        <Globe className="h-4 w-4 mr-2" />
        <span>Global</span>
      </TabsTrigger>
    </TabsList>
  );
};
