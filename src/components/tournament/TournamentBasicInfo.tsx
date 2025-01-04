import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

interface TournamentBasicInfoProps {
  league: Tables<"leagues", never> & {
    creator: {
      username: string | null;
    } | null;
  };
  isAuthenticated: boolean;
  isUserRegistered: boolean | undefined;
}

export const TournamentBasicInfo = ({ 
  league, 
  isAuthenticated, 
  isUserRegistered 
}: TournamentBasicInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl md:text-3xl font-bold">{league.name}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Created by {league.creator?.username}
        </p>
      </div>
      <div>
        {isAuthenticated && !isUserRegistered && (
          <Button asChild className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto">
            <Link to={`/tournament/${league.id}/register`}>Register Now</Link>
          </Button>
        )}
        {isUserRegistered && (
          <Badge variant="secondary" className="px-4 py-2">
            Already Registered
          </Badge>
        )}
      </div>
    </div>
  );
};