import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

interface TournamentTitleProps {
  league: Tables<"leagues", never> & {
    creator: {
      username: string | null;
      full_name: string | null;
    } | null;
  };
  isAuthenticated: boolean;
  isUserRegistered: boolean | undefined;
}

export const TournamentTitle = ({ league, isAuthenticated, isUserRegistered }: TournamentTitleProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          {league.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Created by {league.creator?.full_name || league.creator?.username || 'Unknown'}
        </p>
      </div>
      {isAuthenticated && !isUserRegistered && (
        <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
          <Link to={`/tournament/${league.id}/register`}>Register Now</Link>
        </Button>
      )}
      {isUserRegistered && (
        <Badge variant="secondary" className="px-4 py-2 w-full sm:w-auto text-center">
          Already Registered
        </Badge>
      )}
    </div>
  );
};