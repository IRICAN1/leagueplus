import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Trophy, Bell, BarChart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface TournamentDetailsProps {
  league: Tables<"leagues", never>;
}

export const TournamentDetails = ({ league }: TournamentDetailsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <TooltipProvider>
        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Trophy className="h-5 w-5 text-purple-600 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Format</p>
            </TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <p className="font-medium text-sm">Format</p>
            <p className="text-xs text-muted-foreground truncate">{league.match_format}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Bell className="h-5 w-5 text-purple-600 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>League Rules</p>
            </TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <p className="font-medium text-sm">Rules</p>
            <p className="text-xs text-muted-foreground truncate">{league.rules || "Standard rules apply"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <BarChart className="h-5 w-5 text-purple-600 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>League Statistics</p>
            </TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <p className="font-medium text-sm">Statistics</p>
            <p className="text-xs text-muted-foreground truncate">View rankings and stats</p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};