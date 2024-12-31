import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "./types";

interface PlayerProfileProps {
  player: Player;
}

export const PlayerProfile = ({ player }: PlayerProfileProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
        <AvatarImage 
          src={player.avatar_url} 
          className="object-cover"
        />
        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-medium">
          {player.name[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {player.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {player.points} total points
        </span>
      </div>
    </div>
  );
};