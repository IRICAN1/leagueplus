import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Trophy, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tables } from "@/integrations/supabase/types";

interface TournamentStatsProps {
  league: Tables<"leagues", never>;
}

export const TournamentStats = ({ league }: TournamentStatsProps) => {
  const { data: registeredPlayers } = useQuery({
    queryKey: ['registeredPlayers', league.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('league_participants')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', league.id);
      return count || 0;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <TooltipProvider>
        <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Calendar className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Dates</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium">Dates</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(league.start_date), 'MMM d, yyyy')} - 
              {format(new Date(league.end_date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <MapPin className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Venue Location</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{league.location}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Users className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Participants</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium">Participants</p>
            <p className="text-sm text-muted-foreground">
              {registeredPlayers} / {league.max_participants} registered
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
          <Tooltip>
            <TooltipTrigger>
              <Trophy className="h-5 w-5 text-purple-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Tournament Format</p>
            </TooltipContent>
          </Tooltip>
          <div>
            <p className="font-medium">Format</p>
            <p className="text-sm text-muted-foreground">{league.match_format}</p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};