
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Player } from "./types";

interface PlayerProfileProps {
  player: Player;
}

export const PlayerProfile = ({ player }: PlayerProfileProps) => {
  // Split the name if it contains & to handle duo partnerships
  const names = player.name.split(' & ');
  const isDuo = names.length === 2;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex -space-x-2">
        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
          <AvatarImage 
            src={player.avatar_url} 
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-medium">
            {names[0][0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isDuo && (
          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-purple-100 group-hover:ring-purple-200 transition-all duration-300">
            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700 font-medium">
              {names[1][0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {isDuo ? (
            <span className="flex flex-col">
              <span>{names[0]}</span>
              <span className="text-sm text-gray-500">&</span>
              <span>{names[1]}</span>
            </span>
          ) : (
            player.name
          )}
        </span>
        <span className="text-xs text-muted-foreground">
          {player.points} total points
        </span>
      </div>
    </div>
  );
};
