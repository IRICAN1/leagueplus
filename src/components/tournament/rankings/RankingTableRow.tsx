import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlayerAchievementsList } from "../PlayerAchievementsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RankingTableRowProps {
  player: any;
  currentUserId: string | null;
  onChallenge: (playerId: string, playerName: string) => void;
  getRankStyle: (rank: number) => string;
  sortBy: "points" | "matches";
  isDoubles?: boolean;
  leagueId: string;
}

export const RankingTableRow = ({
  player,
  currentUserId,
  onChallenge,
  getRankStyle,
  sortBy,
  isDoubles,
  leagueId
}: RankingTableRowProps) => {
  const { data: duoPartnership } = useQuery({
    queryKey: ['duo-partnership', player.id, leagueId],
    queryFn: async () => {
      if (!isDoubles) return null;

      const { data, error } = await supabase
        .from('league_participants')
        .select(`
          duo_partnership_id,
          duo_partnerships!left(
            player1_id,
            player2_id,
            player1:profiles!duo_partnerships_player1_id_fkey(
              username,
              full_name,
              avatar_url
            ),
            player2:profiles!duo_partnerships_player2_id_fkey(
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('league_id', leagueId)
        .eq('user_id', player.id)
        .maybeSingle();

      if (error) throw error;
      return data?.duo_partnerships;
    },
    enabled: !!isDoubles && !!player.id && !!leagueId,
  });

  const winRate = player.matches_played > 0
    ? ((player.wins / player.matches_played) * 100).toFixed(1)
    : "0.0";

  const canChallenge = currentUserId && currentUserId !== player.id;

  const renderPlayerOrTeam = () => {
    if (isDoubles && duoPartnership) {
      const partner = duoPartnership.player1_id === player.id
        ? duoPartnership.player2
        : duoPartnership.player1;

      return (
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={player.avatar_url} />
              <AvatarFallback>{player.name[0]}</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={partner.avatar_url} />
              <AvatarFallback>{partner.username[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="font-medium">{player.name} & {partner.username}</div>
            <PlayerAchievementsList player={player} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={player.avatar_url} />
          <AvatarFallback>{player.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{player.name}</div>
          <PlayerAchievementsList player={player} />
        </div>
      </div>
    );
  };

  return (
    <TableRow className={getRankStyle(player.rank)}>
      <TableCell className="font-medium">{player.rank}</TableCell>
      <TableCell>{renderPlayerOrTeam()}</TableCell>
      <TableCell className="text-right">{player.matches_played}</TableCell>
      <TableCell className="text-right">{winRate}%</TableCell>
      <TableCell className="text-right">{player.points}</TableCell>
      <TableCell className="text-right">
        {canChallenge && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChallenge(player.id, player.name)}
          >
            Challenge
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};