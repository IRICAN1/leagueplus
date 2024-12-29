import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface TournamentHeaderProps {
  id: string;
  tournament: {
    title: string;
    location: string;
    date: string;
    description: string;
  };
  isAuthenticated: boolean;
}

export const TournamentHeader = ({ id, tournament, isAuthenticated }: TournamentHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for the tournament.",
      });
      navigate(`/login?returnTo=/tournament/${id}/register`);
      return;
    }
    navigate(`/tournament/${id}/register`);
  };

  return (
    <Card className="mb-8 bg-white/80 shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700">
              Active Tournament
            </Badge>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
              {tournament.title}
            </CardTitle>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              {tournament.location} • {tournament.date}
            </p>
          </div>
          <Button
            onClick={handleRegisterClick}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Register Now
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-700">{tournament.description}</p>
      </CardContent>
    </Card>
  );
};