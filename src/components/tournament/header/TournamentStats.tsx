import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Calendar, MapPin, Users, Trophy, Bell, BarChart } from "lucide-react";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

interface TournamentStatsProps {
  league: Tables<"leagues", never>;
  registeredPlayers: number | null;
}

export const TournamentStats = ({ league, registeredPlayers }: TournamentStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <TooltipProvider>
        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Calendar className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Dates</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium text-sm">Dates</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(league.start_date), 'MMM d')} - {format(new Date(league.end_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <MapPin className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Venue Location</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium text-sm">Location</p>
            <p className="text-xs text-muted-foreground">{league.location}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Users className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Participants</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium text-sm">Participants</p>
            <p className="text-xs text-muted-foreground">
              {registeredPlayers} / {league.max_participants}
            </p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};