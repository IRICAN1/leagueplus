import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LeagueTypeSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={() => navigate("/create-league/single")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Single League
          </CardTitle>
          <CardDescription>Create a league for individual players</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Perfect for individual competitions where players compete one-on-one
          </p>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 hover:from-blue-600/5 hover:via-blue-600/5 hover:to-blue-600/5 transition-all duration-300" />
      </Card>

      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer" onClick={() => navigate("/create-league/duo")}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Duo League
          </CardTitle>
          <CardDescription>Create a league for duo partnerships</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ideal for doubles competitions where pairs of players compete together
          </p>
        </CardContent>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 hover:from-purple-600/5 hover:via-purple-600/5 hover:to-purple-600/5 transition-all duration-300" />
      </Card>
    </div>
  );
};