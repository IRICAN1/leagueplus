import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, UserPlus } from "lucide-react";

interface ResultCardProps {
  title: string;
  location: string;
  distance: number;
  date: string;
  type: string;
}

export const ResultCard = ({
  title,
  location,
  distance,
  date,
  type,
}: ResultCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in border-l-4 border-l-blue-500 hover:scale-[1.01] bg-gray-800/80">
      <CardContent className="p-6 bg-gradient-to-r from-gray-800/90 via-blue-900/50 to-gray-800/90">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <Badge variant="secondary" className="mb-2 bg-blue-900/50 text-blue-200 hover:bg-blue-800">
              {type}
            </Badge>
            <h3 className="text-xl font-bold text-blue-100 group-hover:text-blue-300 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
              {location}
            </p>
            <p className="text-sm text-gray-400">{date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                variant="default"
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join
              </Button>
            </div>
            <Badge variant="outline" className="ml-auto bg-blue-900/30 border-blue-400/30 text-blue-200">
              {distance} km
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};