import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { TournamentTitle } from "./header/TournamentTitle";
import { TournamentStats } from "./header/TournamentStats";
import { TournamentDetails } from "./header/TournamentDetails";

interface TournamentHeaderProps {
  league: Tables<"leagues", never> & {
    creator: {
      username: string | null;
      full_name: string | null;
    } | null;
  };
  isAuthenticated: boolean;
  isUserRegistered: boolean | undefined;
  registeredPlayers: number | null;
}

export const TournamentHeader = ({ 
  league, 
  isAuthenticated,
  isUserRegistered,
  registeredPlayers 
}: TournamentHeaderProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/80 shadow-xl">
      <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6">
        <TournamentTitle 
          league={league} 
          isAuthenticated={isAuthenticated}
          isUserRegistered={isUserRegistered}
        />

        <div className="space-y-4">
          <TournamentStats 
            league={league}
            registeredPlayers={registeredPlayers}
          />
          
          <TournamentDetails league={league} />

          {league.description && (
            <div className="flex items-start space-x-3 bg-muted/50 p-3 md:p-4 rounded-lg mt-4">
              <Info className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{league.description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};