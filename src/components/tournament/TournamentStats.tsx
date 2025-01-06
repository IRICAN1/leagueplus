import { useState } from "react";
import { PlayerRankingsTable } from "./PlayerRankingsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TournamentStatsProps {
  leagueId: string;
}

export const TournamentStats = ({ leagueId }: TournamentStatsProps) => {
  const [sortBy, setSortBy] = useState<"points" | "matches">("points");

  const { data: league } = useQuery({
    queryKey: ['league-format', leagueId],
    queryFn: async () => {
      const { data } = await supabase
        .from('leagues')
        .select('is_doubles, format')
        .eq('id', leagueId)
        .single();
      return data;
    }
  });

  const { data: playerStats } = useQuery({
    queryKey: ['player-stats', leagueId],
    queryFn: async () => {
      const { data } = await supabase
        .from('player_statistics')
        .select(`
          *,
          profiles:player_id (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('league_id', leagueId)
        .order('rank', { ascending: true });
      return data;
    }
  });

  return (
    <PlayerRankingsTable 
      leagueId={leagueId} 
      sortBy={sortBy} 
      playerStats={playerStats}
      isDoubles={league?.is_doubles || league?.format === 'Team'}
    />
  );
};