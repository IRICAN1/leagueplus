
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";
import { LeagueType } from "@/types/league";

interface LeagueTypeSelectorProps {
  leagueType: LeagueType;
  onLeagueTypeChange: (type: LeagueType) => void;
}

export const LeagueTypeSelector = ({ leagueType, onLeagueTypeChange }: LeagueTypeSelectorProps) => {
  return (
    <>
      <Button
        variant={leagueType === 'duo' ? 'default' : 'outline'}
        onClick={() => onLeagueTypeChange('duo')}
        className="relative overflow-hidden transition-all duration-300"
      >
        <Users className="h-4 w-4 mr-2" />
        Duo Leagues
        {leagueType === 'duo' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
        )}
      </Button>
      <Button
        variant={leagueType === 'individual' ? 'default' : 'outline'}
        onClick={() => onLeagueTypeChange('individual')}
        className="relative overflow-hidden transition-all duration-300"
      >
        <User className="h-4 w-4 mr-2" />
        Individual Leagues
        {leagueType === 'individual' && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
        )}
      </Button>
    </>
  );
};
