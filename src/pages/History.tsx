import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2, Trophy, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

const History = () => {
  const { t } = useTranslation();
  
  const { data: matches, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['match-history'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return [];

      const { data, error } = await supabase
        .from('match_challenges')
        .select(`
          *,
          league:leagues(name),
          challenger:profiles!match_challenges_challenger_id_fkey(username, full_name, avatar_url),
          challenged:profiles!match_challenges_challenged_id_fkey(username, full_name, avatar_url)
        `)
        .or(`challenger_id.eq.${userId},challenged_id.eq.${userId}`)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const { data: duoMatches, isLoading: isLoadingDuo } = useQuery({
    queryKey: ['duo-match-history'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return [];

      // First get all partnerships that the user is part of
      const { data: partnerships } = await supabase
        .from('duo_partnerships')
        .select('id')
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`);

      if (!partnerships?.length) return [];

      const partnershipIds = partnerships.map(p => p.id);

      // Then get all completed matches for these partnerships
      const { data, error } = await supabase
        .from('duo_match_challenges')
        .select(`
          *,
          challenger_partnership:duo_partnerships!duo_match_challenges_challenger_partnership_id_fkey(
            id,
            player1:profiles!duo_partnerships_player1_id_fkey(username, full_name, avatar_url),
            player2:profiles!duo_partnerships_player2_id_fkey(id, username, full_name, avatar_url)
          ),
          challenged_partnership:duo_partnerships!duo_match_challenges_challenged_partnership_id_fkey(
            id,
            player1:profiles!duo_partnerships_player1_id_fkey(username, full_name, avatar_url),
            player2:profiles!duo_partnerships_player2_id_fkey(id, username, full_name, avatar_url)
          ),
          league:duo_leagues(name)
        `)
        .or(`challenger_partnership_id.in.(${partnershipIds.join(',')}),challenged_partnership_id.in.(${partnershipIds.join(',')})`)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const parseScore = (score: string | null) => {
    if (!score) return [];
    return score.split('-').map(set => set.trim());
  };

  if (isLoadingHistory || isLoadingDuo) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderMatchCard = (match: any, showScore = true) => {
    const isWinner = match.winner_id === match.challenger_id;
    const winnerName = isWinner ? match.challenger.full_name || match.challenger.username : match.challenged.full_name || match.challenged.username;
    const loserName = !isWinner ? match.challenger.full_name || match.challenger.username : match.challenged.full_name || match.challenged.username;
    const winnerSets = parseScore(match.winner_score);
    const loserSets = parseScore(match.loser_score);

    return (
      <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">{match.league.name}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {format(new Date(match.proposed_time), 'PPp')}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {match.location}
                </p>
              </div>
            </div>
            {showScore && (
              <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600">
                <Trophy className="h-4 w-4 mr-1" />
                {t('history.winner')}: {winnerName}
              </Badge>
            )}
          </div>
          
          {showScore && (
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 p-4 rounded-lg shadow-inner">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50">
                    <TableHead className="w-[200px] font-semibold text-gray-700">{t('history.player')}</TableHead>
                    {winnerSets.map((_, index) => (
                      <TableHead key={index} className="text-center font-semibold text-gray-700">
                        {t('history.set')} {index + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-semibold text-green-700">{winnerName}</span>
                      </div>
                    </TableCell>
                    {winnerSets.map((score, index) => (
                      <TableCell key={index} className="text-center font-bold text-green-600 bg-green-50/50">
                        <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                          {score}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="font-semibold text-red-700">{loserName}</span>
                      </div>
                    </TableCell>
                    {loserSets.map((score, index) => (
                      <TableCell key={index} className="text-center font-bold text-red-600 bg-red-50/50">
                        <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50">
                          {score}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderDuoMatchCard = (match: any) => {
    const winnerPartnership = match.winner_partnership_id === match.challenger_partnership.id 
      ? match.challenger_partnership 
      : match.challenged_partnership;
    const loserPartnership = match.winner_partnership_id === match.challenger_partnership.id 
      ? match.challenged_partnership 
      : match.challenger_partnership;
    const winnerSets = parseScore(match.winner_score);
    const loserSets = parseScore(match.loser_score);

    return (
      <Card key={match.id} className="p-6 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">{match.league.name}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {format(new Date(match.proposed_time), 'PPp')}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {match.location}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-600">
              <Trophy className="h-4 w-4 mr-1" />
              {t('history.winners')}: {winnerPartnership.player1.full_name} & {winnerPartnership.player2.full_name}
            </Badge>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 p-4 rounded-lg shadow-inner">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50">
                  <TableHead className="w-[200px] font-semibold text-gray-700">{t('history.team')}</TableHead>
                  {winnerSets.map((_, index) => (
                    <TableHead key={index} className="text-center font-semibold text-gray-700">
                      {t('history.set')} {index + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-semibold text-green-700">
                        {winnerPartnership.player1.full_name} & {winnerPartnership.player2.full_name}
                      </span>
                    </div>
                  </TableCell>
                  {winnerSets.map((score, index) => (
                    <TableCell key={index} className="text-center font-bold text-green-600 bg-green-50/50">
                      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                        {score}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-semibold text-red-700">
                        {loserPartnership.player1.full_name} & {loserPartnership.player2.full_name}
                      </span>
                    </div>
                  </TableCell>
                  {loserSets.map((score, index) => (
                    <TableCell key={index} className="text-center font-bold text-red-600 bg-red-50/50">
                      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50">
                        {score}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{t('history.title')}</h1>
      
      <Tabs defaultValue="duo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="duo">{t('matches.duoMatches')}</TabsTrigger>
          <TabsTrigger value="history">{t('matches.individualMatches')}</TabsTrigger>
        </TabsList>

        <TabsContent value="duo" className="space-y-4">
          {!duoMatches?.length ? (
            <p className="text-gray-500 text-center py-8">{t('history.noCompletedDuoMatches')}</p>
          ) : (
            duoMatches.map(match => renderDuoMatchCard(match))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {!matches?.length ? (
            <p className="text-gray-500 text-center py-8">{t('history.noCompletedMatches')}</p>
          ) : (
            matches.map(match => renderMatchCard(match))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
