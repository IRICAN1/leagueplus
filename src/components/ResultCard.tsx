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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in border-l-4 border-l-purple-500 hover:scale-[1.02]">
      <CardContent className="p-6 bg-gradient-to-r from-white to-purple-50">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            <Badge variant="secondary" className="mb-2 bg-purple-100 text-purple-700 hover:bg-purple-200">
              {type}
            </Badge>
            <h3 className="text-xl font-bold text-purple-900 group-hover:text-purple-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded-full bg-purple-200" />
              {location}
            </p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-purple-500 transition-colors"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button 
                variant="default"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join
              </Button>
            </div>
            <Badge variant="outline" className="ml-auto bg-purple-50 border-purple-200 text-purple-700">
              {distance} km
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};