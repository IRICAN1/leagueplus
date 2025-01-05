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
  const winnerScore = `${result.winnerScore1}-${result.winnerScore2}`;
  const loserScore = `${result.loserScore1}-${result.loserScore2}`;

  const updateData: any = {
    winner_id: result.winnerId,
    winner_score: winnerScore,
    loser_score: loserScore,
    status: 'completed',
    result_status: 'pending'
  };

  if (result.showThirdSet) {
    updateData.winner_score_set3 = result.winnerScore3;
    updateData.loser_score_set3 = result.loserScore3;
  }

  const { data, error } = await supabase
    .from('match_challenges')
    .update(updateData)
    .eq('id', challenge.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};