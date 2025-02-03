import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Users, CircleDot } from "lucide-react";
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
  format?: 'Individual' | 'Team';
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
  format = 'Individual',
}: ResultCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      // Redirect to duo-tournament for Team format leagues
      if (format === 'Team') {
        navigate(`/duo-tournament/${id}`);
      } else {
        navigate(`/tournament/${id}`);
      }
    }
  };

  const getStatusColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'full':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in border-l-4 border-l-blue-400 hover:scale-[1.01] bg-white/80 cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-3 bg-gradient-to-r from-gray-50/90 via-blue-50/50 to-gray-50/90">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className={getStatusColor(type)}>
              <CircleDot className="h-3 w-3 mr-1" />
              {type}
            </Badge>
            {sportType && (
              <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-600">
                <Trophy className="h-3 w-3 mr-1" />
                {sportType}
              </Badge>
            )}
            {genderCategory && (
              <Badge variant="outline" className="bg-pink-50 border-pink-200 text-pink-600">
                {genderCategory}
              </Badge>
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <div className="flex items-center justify-between text-sm">
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                {location}
              </p>
              {distance > 0 && (
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600">
                  {distance} km
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>{date}</span>
              {skillLevel && (
                <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-600">
                  <Star className="h-3 w-3 mr-1" />
                  Level {skillLevel}
                </Badge>
              )}
            </div>
            {participants && (
              <span className="flex items-center gap-1 text-gray-600">
                <Users className="h-3 w-3" />
                {participants}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};