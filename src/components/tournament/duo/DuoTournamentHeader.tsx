
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DuoTournamentHeaderProps {
  name: string;
  creatorName: string | null;
  isAuthenticated: boolean;
  isUserRegistered: boolean | undefined;
  onRegisterClick: () => void;
}

export const DuoTournamentHeader = ({
  name,
  creatorName,
  isAuthenticated,
  isUserRegistered,
  onRegisterClick,
}: DuoTournamentHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          {name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Created by {creatorName || 'Unknown'}
        </p>
      </div>
      
      <div className="w-full flex flex-wrap gap-2">
        {isAuthenticated && !isUserRegistered && (
          <Button 
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            onClick={onRegisterClick}
          >
            Register Now
          </Button>
        )}
      </div>
    </div>
  );
};

