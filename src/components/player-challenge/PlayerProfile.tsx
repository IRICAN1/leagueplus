import { MapPin, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlayerProfileProps {
  player: {
    name: string;
    rank: number;
    wins: number;
    losses: number;
    points: number;
    primary_location?: string;
    achievements: Array<{
      title: string;
      icon: any;
    }>;
  };
}

export const PlayerProfile = ({ player }: PlayerProfileProps) => {
  return (
    <Card className="bg-white/80 shadow-lg animate-fade-in">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{player.name}</h2>
            <Badge variant="secondary" className="text-blue-700">
              Rank #{player.rank}
            </Badge>
          </div>
          
          {player.primary_location && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{player.primary_location}</span>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">{player.wins}</div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-red-600">{player.losses}</div>
              <div className="text-sm text-gray-600">Losses</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{player.points}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {player.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 border-blue-200 text-blue-600 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {achievement.title}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};