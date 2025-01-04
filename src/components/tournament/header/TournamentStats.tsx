import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

interface TournamentStatsProps {
  league: Tables<"leagues", never>;
  registeredPlayers: number | null;
}

export const TournamentStats = ({ league, registeredPlayers }: TournamentStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      <TooltipProvider>
        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Calendar className="h-5 w-5 text-purple-600 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Dates</p>
            </TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <p className="font-medium text-sm">Dates</p>
            <p className="text-xs text-muted-foreground truncate">
              {format(new Date(league.start_date), 'MMM d')} - {format(new Date(league.end_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <MapPin className="h-5 w-5 text-purple-600 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Venue Location</p>
            </TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <p className="font-medium text-sm">Location</p>
            <p className="text-xs text-muted-foreground truncate">{league.location}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Users className="h-5 w-5 text-purple-600 flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Participants</p>
            </TooltipContent>
          </Tooltip>
          <div className="min-w-0">
            <p className="font-medium text-sm">Participants</p>
            <p className="text-xs text-muted-foreground truncate">
              {registeredPlayers} / {league.max_participants}
            </p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};