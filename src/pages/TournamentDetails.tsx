import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Swords, BadgeCheck, BadgeInfo, BadgeDollarSign } from "lucide-react";
import { Link } from "react-router-dom";
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
        achievements: [
          { title: "Tournament Winner", icon: Trophy },
          { title: "Perfect Season", icon: BadgeCheck },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        rank: 2,
        wins: 12,
        losses: 6,
        points: 1200,
        achievements: [
          { title: "Most Improved", icon: BadgeInfo },
          { title: "Prize Winner", icon: BadgeDollarSign },
        ],
      },
      {
        id: 3,
        name: "Michael Johnson",
        rank: 3,
        wins: 11,
        losses: 4,
        points: 1150,
        achievements: [{ title: "Rising Star", icon: Award }],
      },
      {
        id: 4,
        name: "Sarah Williams",
        rank: 4,
        wins: 10,
        losses: 5,
        points: 1100,
        achievements: [{ title: "Most Consistent", icon: BadgeCheck }],
      },
      {
        id: 5,
        name: "David Brown",
        rank: 5,
        wins: 9,
        losses: 7,
        points: 1050,
        achievements: [{ title: "Comeback Player", icon: Trophy }],
      },
      {
        id: 6,
        name: "Emma Davis",
        rank: 6,
        wins: 8,
        losses: 8,
        points: 1000,
        achievements: [{ title: "Fan Favorite", icon: BadgeInfo }],
      },
      {
        id: 7,
        name: "James Wilson",
        rank: 7,
        wins: 8,
        losses: 7,
        points: 950,
        achievements: [{ title: "Most Improved", icon: Award }],
      },
      {
        id: 8,
        name: "Olivia Taylor",
        rank: 8,
        wins: 7,
        losses: 9,
        points: 900,
        achievements: [{ title: "Rookie of the Year", icon: Trophy }],
      },
      {
        id: 9,
        name: "William Anderson",
        rank: 9,
        wins: 7,
        losses: 8,
        points: 850,
        achievements: [{ title: "Most Sportsman", icon: BadgeCheck }],
      },
      {
        id: 10,
        name: "Sophie Martinez",
        rank: 10,
        wins: 6,
        losses: 10,
        points: 800,
        achievements: [{ title: "Best Server", icon: BadgeDollarSign }],
      },
      {
        id: 11,
        name: "Lucas Garcia",
        rank: 11,
        wins: 6,
        losses: 9,
        points: 750,
        achievements: [{ title: "Most Determined", icon: Award }],
      },
      {
        id: 12,
        name: "Isabella Lopez",
        rank: 12,
        wins: 5,
        losses: 11,
        points: 700,
        achievements: [{ title: "Best Doubles", icon: Trophy }],
      },
      {
        id: 13,
        name: "Ethan Lee",
        rank: 13,
        wins: 5,
        losses: 10,
        points: 650,
        achievements: [{ title: "Most Creative", icon: BadgeInfo }],
      },
      {
        id: 14,
        name: "Ava Rodriguez",
        rank: 14,
        wins: 4,
        losses: 12,
        points: 600,
        achievements: [{ title: "Best Backhand", icon: BadgeCheck }],
      },
      {
        id: 15,
        name: "Noah Kim",
        rank: 15,
        wins: 4,
        losses: 11,
        points: 550,
        achievements: [{ title: "Most Resilient", icon: Award }],
      },
      {
        id: 16,
        name: "Mia Patel",
        rank: 16,
        wins: 3,
        losses: 13,
        points: 500,
        achievements: [{ title: "Best Forehand", icon: Trophy }],
      },
      {
        id: 17,
        name: "Alexander Chen",
        rank: 17,
        wins: 3,
        losses: 12,
        points: 450,
        achievements: [{ title: "Most Improved Serve", icon: BadgeInfo }],
      },
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="w-48">Achievements</TableHead>
                  <TableHead className="text-right w-20">Wins</TableHead>
                  <TableHead className="text-right w-20">Losses</TableHead>
                  <TableHead className="text-right w-20">Points</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournament.players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-bold text-blue-600">
                      #{player.rank}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {player.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {player.achievements.map((achievement, index) => {
                          const Icon = achievement.icon;
                          return (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 border-blue-200 text-blue-600"
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {achievement.title}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {player.wins}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {player.losses}
                    </TableCell>
                    <TableCell className="text-right font-medium text-blue-600">
                      {player.points}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        asChild
                      >
                        <Link to={`/player-challenge/${player.id}`}>
                          <Swords className="h-4 w-4 mr-2" />
                          Challenge
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentDetails;