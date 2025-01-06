import { supabase } from "@/integrations/supabase/client";
import { Challenge } from "@/types/match";
import { useQueryClient } from "@tanstack/react-query";

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

  console.log('Starting match result submission for challenge:', challenge.id);

  const updateData = {
    winner_id: result.winnerId,
    winner_score: winnerScore,
    loser_score: loserScore,
    status: 'completed',
    result_status: 'pending',
    updated_at: new Date().toISOString()
  } as const;

  if (result.showThirdSet && result.winnerScore3 && result.loserScore3) {
    Object.assign(updateData, {
      winner_score_set3: result.winnerScore3,
      loser_score_set3: result.loserScore3
    });
  }

  console.log('Update data prepared:', updateData);

  try {
    const { data, error } = await supabase
      .from('match_challenges')
      .update(updateData)
      .eq('id', challenge.id)
      .select(`
        *,
        challenger:profiles!match_challenges_challenger_id_fkey(username),
        challenged:profiles!match_challenges_challenged_id_fkey(username)
      `)
      .single();

    if (error) {
      console.error('Error in submitMatchResult:', error);
      throw error;
    }

    console.log('Match result submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to submit match result:', error);
    throw error;
  }
};