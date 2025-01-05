import { supabase } from "@/integrations/supabase/client";
import { Challenge } from "@/types/match";

interface MatchResult {
  winnerId: string;
  winnerScore1: string;
  loserScore1: string;
  winnerScore2: string;
  loserScore2: string;
  winnerScore3?: string;
  loserScore3?: string;
  showThirdSet: boolean;
}

export const submitMatchResult = async (
  challenge: Challenge,
  result: MatchResult
) => {
  const winnerScore = `${result.winnerScore1}-${result.winnerScore2}${
    result.showThirdSet ? `-${result.winnerScore3}` : ''
  }`;
  const loserScore = `${result.loserScore1}-${result.loserScore2}${
    result.showThirdSet ? `-${result.loserScore3}` : ''
  }`;

  const updateData: any = {
    winner_id: result.winnerId,
    winner_score: winnerScore,
    loser_score: loserScore,
    status: 'completed',
    result_status: 'pending',
    updated_at: new Date().toISOString()
  };

  if (result.showThirdSet && result.winnerScore3 && result.loserScore3) {
    updateData.winner_score_set3 = result.winnerScore3;
    updateData.loser_score_set3 = result.loserScore3;
  }

  console.log('Submitting match result for challenge:', challenge.id, updateData);

  const { data, error } = await supabase
    .from('match_challenges')
    .update(updateData)
    .eq('id', challenge.id) // This is the crucial WHERE clause
    .select('*, challenger:profiles!match_challenges_challenger_id_fkey(username), challenged:profiles!match_challenges_challenged_id_fkey(username)')
    .single();

  if (error) {
    console.error('Error in submitMatchResult:', error);
    throw error;
  }

  console.log('Match result submitted successfully:', data);
  return data;
};