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
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface TournamentHeaderProps {
  league: Tables<"leagues"> & {
    creator: {
      username: string | null;
    } | null;
  };
  isAuthenticated: boolean;
}

export const TournamentHeader = ({ league, isAuthenticated }: TournamentHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{league.name}</h1>
          <p className="text-gray-600">Created by {league.creator?.username}</p>
        </div>
        {isAuthenticated && (
          <Button asChild>
            <Link to={`/tournament/${league.id}/register`}>Register Now</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TooltipProvider>
          {/* Dates Section */}
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <Calendar className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tournament Dates</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="font-medium">Dates</p>
              <p className="text-sm text-gray-600">
                {format(new Date(league.start_date), 'MMM d, yyyy')} - {format(new Date(league.end_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Location Section */}
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <MapPin className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Venue Location</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-gray-600">{league.location}</p>
            </div>
          </div>

          {/* Participants Section */}
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <Users className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum Participants</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="font-medium">Participants</p>
              <p className="text-sm text-gray-600">Max: {league.max_participants}</p>
            </div>
          </div>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TooltipProvider>
          {/* Format Section */}
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <Trophy className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tournament Format</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="font-medium">Format</p>
              <p className="text-sm text-gray-600">{league.match_format}</p>
            </div>
          </div>

          {/* Rules Section */}
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <Bell className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>League Rules</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="font-medium">Rules</p>
              <p className="text-sm text-gray-600">{league.rules || "Standard rules apply"}</p>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="flex items-center space-x-3">
            <Tooltip>
              <TooltipTrigger>
                <BarChart className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p>League Statistics</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="font-medium">Statistics</p>
              <p className="text-sm text-gray-600">View rankings and stats</p>
            </div>
          </div>
        </TooltipProvider>
      </div>

      {league.description && (
        <div className="flex items-start space-x-3 mt-6">
          <Info className="h-5 w-5 text-gray-600 mt-1" />
          <p className="text-gray-600">{league.description}</p>
        </div>
      )}
    </div>
  );
};