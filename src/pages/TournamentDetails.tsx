import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    ],
  };

  const handleChallenge = (playerId: number) => {
    navigate(`/challenge/${playerId}`);
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
            <p className="text-gray-700 mb-6">{tournament.description}</p>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-blue-500" />
                  Player Rankings & Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="w-32">Achievements</TableHead>
                        <TableHead className="text-right w-20">Wins</TableHead>
                        <TableHead className="text-right w-20">Losses</TableHead>
                        <TableHead className="text-right w-24">Points</TableHead>
                        <TableHead className="w-28">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournament.players.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">#{player.rank}</TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
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
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {player.wins}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {player.losses}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {player.points}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleChallenge(player.id)}
                            >
                              Challenge
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentDetails;