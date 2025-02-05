import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface DuoPartnership {
  id: string;
  player1: {
    username: string;
    avatar_url: string;
  };
  player2: {
    username: string;
    avatar_url: string;
  };
  duo_statistics: {
    wins: number;
    losses: number;
  }[];
}

interface DuoLeagueParticipant {
  duo_partnership: DuoPartnership;
}

interface TournamentStatsProps {
  leagueId?: string;
  isDuo?: boolean;
}

export const TournamentStats: React.FC<TournamentStatsProps> = ({ leagueId, isDuo }) => {
  const { id: routeLeagueId } = useParams();
  const finalLeagueId = leagueId || routeLeagueId;

  const { data: participants } = useQuery({
    queryKey: ['duoLeagueParticipants', finalLeagueId],
    queryFn: async () => {
      if (!isDuo) return null;
      
      const { data: participants, error } = await supabase
        .from('duo_league_participants')
        .select(`
          *,
          duo_partnership:duo_partnerships(
            id,
            player1:profiles!duo_partnerships_player1_id_fkey(
              username,
              avatar_url
            ),
            player2:profiles!duo_partnerships_player2_id_fkey(
              username,
              avatar_url
            ),
            duo_statistics(
              wins,
              losses
            )
          )
        `)
        .eq('league_id', finalLeagueId)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      return participants as DuoLeagueParticipant[];
    },
    enabled: isDuo && !!finalLeagueId
  });

  const totalParticipants = participants?.length || 0;
  const totalMatches = participants?.reduce((acc, participant) => {
    const stats = participant.duo_partnership.duo_statistics[0];
    return acc + (stats ? stats.wins + stats.losses : 0);
  }, 0) || 0;

  const totalWins = participants?.reduce((acc, participant) => {
    const stats = participant.duo_partnership.duo_statistics[0];
    return acc + (stats ? stats.wins : 0);
  }, 0) || 0;

  const averageMatchesPerDuo = totalParticipants
    ? (totalMatches / totalParticipants).toFixed(1)
    : '0';

  const stats = [
    {
      label: isDuo ? 'Total Duos' : 'Total Players',
      value: totalParticipants,
    },
    {
      label: 'Total Matches',
      value: totalMatches,
    },
    {
      label: 'Total Wins',
      value: totalWins,
    },
    {
      label: isDuo ? 'Avg Matches per Duo' : 'Avg Matches per Player',
      value: averageMatchesPerDuo,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};