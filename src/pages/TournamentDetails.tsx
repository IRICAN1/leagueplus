import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Swords, UserCheck } from "lucide-react";

const TournamentDetails = () => {
  const { id } = useParams();

  // Mock data for demonstration
  const tournament = {
    title: "Tennis Tournament 2024",
    location: "Tennis Club Paris",
    date: "January 15, 2024",
    description: "Join our prestigious tennis tournament and compete against the best players in the region.",
    players: [
      {
        id: 1,
        name: "John Doe",
        rank: 1,
        wins: 15,
        losses: 3,
        points: 1500,
        achievements: ["Tournament Winner", "Perfect Season"],
      },
      {
        id: 2,
        name: "Jane Smith",
        rank: 2,
        wins: 12,
        losses: 6,
        points: 1200,
        achievements: ["Most Improved"],
      },
      // Add more players as needed
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
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
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Trophy className="mr-2 h-4 w-4" />
                Register Now
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700">{tournament.description}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-blue-500" />
              Player Rankings & Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tournament.players.map((player) => (
                <div
                  key={player.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <span className="text-2xl font-bold text-blue-600">#{player.rank}</span>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{player.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {player.achievements.map((achievement, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-50 border-blue-200 text-blue-600"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                    <div className="text-center p-2 rounded-md bg-green-50">
                      <div className="text-green-600 text-xs font-semibold">Wins</div>
                      <div className="text-lg font-bold text-green-700">
                        {player.wins}
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-md bg-red-50">
                      <div className="text-red-600 text-xs font-semibold">Losses</div>
                      <div className="text-lg font-bold text-red-700">
                        {player.losses}
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-md bg-blue-50 col-span-2 sm:col-span-1">
                      <div className="text-blue-600 text-xs font-semibold">Points</div>
                      <div className="text-lg font-bold text-blue-700">
                        {player.points}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full sm:w-auto mt-3 sm:mt-0 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Swords className="h-4 w-4 mr-2" />
                    Challenge
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentDetails;
