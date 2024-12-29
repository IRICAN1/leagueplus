import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, UserPlus, Users, Trophy, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultCardProps {
  id?: string;
  title: string;
  location: string;
  distance: number;
  date: string;
  type: string;
  sportType?: string;
  skillLevel?: string;
  genderCategory?: string;
  participants?: number;
}

export const ResultCard = ({
  id = "1",
  title,
  location,
  distance,
  date,
  type,
  sportType,
  skillLevel,
  genderCategory,
  participants,
}: ResultCardProps) => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/tournament/${id}`);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in border-l-4 border-l-blue-400 hover:scale-[1.01] bg-white/80">
      <CardContent className="p-6 bg-gradient-to-r from-gray-50/90 via-blue-50/50 to-gray-50/90">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                {type}
              </Badge>
              {sportType && (
                <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600">
                  <Trophy className="h-3 w-3 mr-1" />
                  {sportType}
                </Badge>
              )}
              {skillLevel && (
                <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-600">
                  <Star className="h-3 w-3 mr-1" />
                  Level {skillLevel}
                </Badge>
              )}
              {genderCategory && (
                <Badge variant="outline" className="bg-pink-50 border-pink-200 text-pink-600">
                  {genderCategory}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
              {location}
            </p>
            <p className="text-sm text-gray-500">{date}</p>
            {participants && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max participants: {participants}</span>
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                variant="default"
                onClick={handleJoin}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
            {distance > 0 && (
              <Badge variant="outline" className="ml-auto bg-blue-50 border-blue-200 text-blue-600">
                {distance} km
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};