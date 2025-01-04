import { MapPin, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    avatar_url?: string;
  };
}

export const PlayerProfile = ({ player }: PlayerProfileProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-blue-100">
            <AvatarImage src={player.avatar_url} alt={player.name} />
            <AvatarFallback className="bg-blue-50 text-blue-600">
              {player.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">{player.name}</h2>
              <Badge variant="secondary" className="text-blue-700">
                #{player.rank}
              </Badge>
            </div>
            
            {player.primary_location && (
              <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                <span>{player.primary_location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 bg-blue-50 rounded-lg text-center">
          <div className="text-lg font-semibold text-green-600">{player.wins}</div>
          <div className="text-xs text-gray-600">Wins</div>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg text-center">
          <div className="text-lg font-semibold text-red-600">{player.losses}</div>
          <div className="text-xs text-gray-600">Losses</div>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg text-center">
          <div className="text-lg font-semibold text-blue-600">{player.points}</div>
          <div className="text-xs text-gray-600">Points</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {player.achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <Badge
              key={index}
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-600 text-xs py-0.5 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon className="h-3 w-3 mr-1" />
              {achievement.title}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};