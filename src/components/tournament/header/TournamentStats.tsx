import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TournamentStatsProps {
  league: Tables<"leagues", never> | Tables<"duo_leagues", never>;
  registeredPlayers: number | null;
  leagueId?: string;
  isDuo?: boolean;
}

export const TournamentStats = ({ league, registeredPlayers, leagueId, isDuo }: TournamentStatsProps) => {
  const { data: duoParticipants } = useQuery({
    queryKey: ['duo-participants', leagueId],
    queryFn: async () => {
      if (!isDuo || !leagueId) return null;
      
      const { data, error } = await supabase
        .from('duo_league_participants')
        .select(`
          *,
          duo_partnership:duo_partnerships(
            id,
            player1:profiles!duo_partnerships_player1_id_fkey(
              username,
              avatar_url
            ),
            player2:profiles!duo_partnerships_player2_id_fkey(
              username,
              avatar_url
            ),
            duo_statistics(
              wins,
              losses
            )
          )
        `)
        .eq('league_id', leagueId)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: isDuo && !!leagueId
  });

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
              {registeredPlayers} / {isDuo ? (league as Tables<"duo_leagues", never>).max_duo_pairs * 2 : (league as Tables<"leagues", never>).max_participants}
            </p>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};