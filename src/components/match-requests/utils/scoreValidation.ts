export const isValidTennisScore = (score1: string, score2: string, isTiebreak: boolean) => {
  const s1 = parseInt(score1);
  const s2 = parseInt(score2);
  
  if (isNaN(s1) || isNaN(s2)) return false;
  if (s1 < 0 || s2 < 0) return false;

  // Regular set rules
  if (!isTiebreak) {
    if (s1 > 6 || s2 > 6) return false;
    if (s1 === 6 && s2 > 4) return true;
    if (s2 === 6 && s1 > 4) return true;
    if (Math.abs(s1 - s2) < 2 && Math.max(s1, s2) === 6) return false;
    return Math.abs(s1 - s2) >= 2;
  }
  
  // Tiebreak rules
  if (Math.max(s1, s2) === 7 && Math.min(s1, s2) === 6) return true;
  return false;
};