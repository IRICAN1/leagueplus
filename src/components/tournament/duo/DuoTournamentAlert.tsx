
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DuoTournamentAlertProps {
  tournamentId: string;
}

export const DuoTournamentAlert = ({ tournamentId }: DuoTournamentAlertProps) => {
  const navigate = useNavigate();

  return (
    <Alert>
      <AlertDescription className="flex items-center justify-between">
        <span>Sign in to register for this league and access all features.</span>
        <Button 
          variant="outline" 
          onClick={() => navigate('/login', { state: { returnTo: `/duo-tournament/${tournamentId}` } })}
          className="ml-4"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </AlertDescription>
    </Alert>
  );
};

