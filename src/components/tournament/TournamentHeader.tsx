import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Bell,
  BarChart,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TournamentHeaderProps {
  league: Tables<"leagues"> & {
    creator: {
      username: string | null;
    } | null;
  };
  isAuthenticated: boolean;
}

export const TournamentHeader = ({ league, isAuthenticated }: TournamentHeaderProps) => {
  // Query to get the number of registered players
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

  // Check if current user is registered
  const { data: isUserRegistered } = useQuery({
    queryKey: ['isUserRegistered', league.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { count } = await supabase
        .from('league_participants')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', league.id)
        .eq('user_id', session.user.id);
      
      return count ? count > 0 : false;
    },
    enabled: isAuthenticated,
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-3xl font-bold">{league.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Created by {league.creator?.username}</p>
          </div>
          {isAuthenticated && !isUserRegistered && (
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to={`/tournament/${league.id}/register`}>Register Now</Link>
            </Button>
          )}
          {isUserRegistered && (
            <Badge variant="secondary" className="px-4 py-2">
              Already Registered
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Primary Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TooltipProvider>
              {/* Dates Section */}
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
                    {format(new Date(league.start_date), 'MMM d, yyyy')} - {format(new Date(league.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              {/* Location Section */}
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

              {/* Participants Section */}
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
            </TooltipProvider>
          </div>

          {/* Secondary Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TooltipProvider>
              {/* Format Section */}
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

              {/* Rules Section */}
              <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
                <Tooltip>
                  <TooltipTrigger>
                    <Bell className="h-5 w-5 text-purple-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>League Rules</p>
                  </TooltipContent>
                </Tooltip>
                <div>
                  <p className="font-medium">Rules</p>
                  <p className="text-sm text-muted-foreground">{league.rules || "Standard rules apply"}</p>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="flex items-center space-x-3 bg-muted/50 p-4 rounded-lg">
                <Tooltip>
                  <TooltipTrigger>
                    <BarChart className="h-5 w-5 text-purple-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>League Statistics</p>
                  </TooltipContent>
                </Tooltip>
                <div>
                  <p className="font-medium">Statistics</p>
                  <p className="text-sm text-muted-foreground">View rankings and stats</p>
                </div>
              </div>
            </TooltipProvider>
          </div>

          {/* Description Section */}
          {league.description && (
            <div className="flex items-start space-x-3 bg-muted/50 p-4 rounded-lg">
              <Info className="h-5 w-5 text-purple-600 mt-1" />
              <p className="text-muted-foreground">{league.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};