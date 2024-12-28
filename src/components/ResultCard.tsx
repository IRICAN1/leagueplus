import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResultCardProps {
  id?: string;
  title: string;
  location: string;
  distance: number;
  date: string;
  type: string;
}

export const ResultCard = ({
  id = "1",
  title,
  location,
  distance,
  date,
  type,
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
            <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
              {type}
            </Badge>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
              {location}
            </p>
            <p className="text-sm text-gray-500">{date}</p>
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
                Join
              </Button>
            </div>
            <Badge variant="outline" className="ml-auto bg-blue-50 border-blue-200 text-blue-600">
              {distance} km
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};