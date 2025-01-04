import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Trophy, Bell, BarChart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TournamentDetailsProps {
  league: Tables<"leagues", never>;
}

export const TournamentDetails = ({ league }: TournamentDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full md:hidden">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-between p-2">
          <span>Tournament Details</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
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
      </CollapsibleContent>

      {/* Desktop view */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
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
    </Collapsible>
  );
};