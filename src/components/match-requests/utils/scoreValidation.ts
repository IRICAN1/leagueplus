export const isValidTennisScore = (score1: string, score2: string, isTiebreak: boolean) => {
  const s1 = parseInt(score1);
  const s2 = parseInt(score2);
  
  if (isNaN(s1) || isNaN(s2)) return false;
  if (s1 < 0 || s2 < 0) return false;

  // Regular set rules
  if (!isTiebreak) {
    if (s1 > 6 || s2 > 6) return false;
    if (s1 === 6 && s2 <= 4) return true;
    if (s2 === 6 && s1 <= 4) return true;
    if (Math.abs(s1 - s2) < 2 && Math.max(s1, s2) === 6) return false;
    return Math.abs(s1 - s2) >= 2;
  }
  
  // Tiebreak rules
  if (s1 === 7 && s2 <= 5) return true;
  if (s2 === 7 && s1 <= 5) return true;
  return false;
};

export const validateMatchResult = (
  winnerScore1: string,
  loserScore1: string,
  winnerScore2: string,
  loserScore2: string,
  winnerScore3: string | null,
  loserScore3: string | null,
  isTiebreak1: boolean,
  isTiebreak2: boolean,
  isTiebreak3: boolean
) => {
  // Validate first two sets
  if (!isValidTennisScore(winnerScore1, loserScore1, isTiebreak1) ||
      !isValidTennisScore(winnerScore2, loserScore2, isTiebreak2)) {
    return false;
  }

  // If third set exists, validate it
  if (winnerScore3 && loserScore3) {
    if (!isValidTennisScore(winnerScore3, loserScore3, isTiebreak3)) {
      return false;
    }
  }

  return true;
};