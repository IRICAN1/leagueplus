import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Users } from "lucide-react";
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

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in border-l-4 border-l-blue-400 hover:scale-[1.01] bg-white/80 cursor-pointer"
      onClick={() => navigate(`/tournament/${id}`)}
    >
      <CardContent className="p-3 md:p-4 bg-gradient-to-r from-gray-50/90 via-blue-50/50 to-gray-50/90">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap gap-1 mb-1">
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
            </div>
            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
                {location}
              </p>
              {distance > 0 && (
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-600">
                  {distance} km
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{date}</span>
              {participants && (
                <span className="flex items-center gap-1 text-gray-600">
                  <Users className="h-3 w-3" />
                  {participants}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};