import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

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
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-2">
              {type}
            </Badge>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{location}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Badge variant="outline" className="ml-auto">
              {distance} km
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};