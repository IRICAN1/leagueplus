
import { Medal, Trophy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DesktopRankingsTableProps {
  players: any[];
  sortType: 'points' | 'matches' | 'winrate';
}

export const DesktopRankingsTable = ({ players, sortType }: DesktopRankingsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Team</TableHead>
          <TableHead className="text-right">Location</TableHead>
          <TableHead className="text-right">W/L</TableHead>
          <TableHead className="text-right">
            {sortType === 'points' ? 'Points' : 
             sortType === 'matches' ? 'Matches' : 'Win Rate'}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => (
          <TableRow key={player.id} className={index < 3 && sortType !== 'winrate' ? 'bg-blue-50/30' : ''}>
            <TableCell className="font-medium">
              {sortType !== 'winrate' && player.stats.rank <= 3 ? (
                player.stats.rank === 1 ? (
                  <Trophy className="h-5 w-5 text-yellow-500 inline-block mr-1" />
                ) : player.stats.rank === 2 ? (
                  <Medal className="h-5 w-5 text-gray-500 inline-block mr-1" />
                ) : (
                  <Medal className="h-5 w-5 text-amber-500 inline-block mr-1" />
                )
              ) : null}
              #{sortType === 'winrate' ? index + 1 : (player.stats.rank === 999999 ? '-' : player.stats.rank)}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-3">
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
                <div className="font-medium">{player.player1.name} & {player.player2.name}</div>
              </div>
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {player.player1.location || 'Unknown location'}
            </TableCell>
            <TableCell className="text-right">
              <span className="text-green-600 font-medium">{player.stats.wins}</span>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-red-600 font-medium">{player.stats.losses}</span>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline" className={`
                ${sortType === 'points' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                  sortType === 'matches' ? 'bg-green-100 text-green-700 border-green-200' :
                  'bg-purple-100 text-purple-700 border-purple-200'}
              `}>
                {sortType === 'points' ? `${player.stats.points}` : 
                 sortType === 'matches' ? `${player.stats.matchesPlayed}` :
                 `${player.stats.winRate}%`}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
