
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileRankingsListProps {
  players: any[];
  sortType: 'points' | 'matches' | 'winrate' | 'global';
}

export const MobileRankingsList = ({ players, sortType }: MobileRankingsListProps) => {
  return (
    <div className="p-3 space-y-3">
      {players.map((player, index) => (
        <Card key={player.id} className="overflow-hidden shadow-sm">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-white text-blue-600 font-bold">
                #{sortType === 'winrate' || sortType === 'global' ? index + 1 : (player.stats.rank === 999999 ? '-' : player.stats.rank)}
              </Badge>
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={player.player1.avatar} />
                  <AvatarFallback>{player.player1.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={player.player2.avatar} />
                  <AvatarFallback>{player.player2.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Badge 
              className={`${
                sortType === 'points' || sortType === 'global' ? 'bg-blue-100 text-blue-700' : 
                sortType === 'matches' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}
            >
              {sortType === 'points' || sortType === 'global' ? `${player.stats.points} pts` : 
               sortType === 'matches' ? `${player.stats.matchesPlayed} matches` :
               `${player.stats.winRate}% wins`}
            </Badge>
          </div>
          <div className="p-3">
            <div className="text-sm font-semibold mb-1">
              {player.player1.name} & {player.player2.name}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>{player.player1.location || 'Unknown location'}</div>
              <div>
                <span className="text-green-600 font-medium">{player.stats.wins}</span>
                <span className="mx-1">/</span>
                <span className="text-red-600 font-medium">{player.stats.losses}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
