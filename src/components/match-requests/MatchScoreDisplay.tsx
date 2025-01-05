interface MatchScoreDisplayProps {
  winnerScore: string;
  loserScore: string;
  winnerUsername: string;
}

export const MatchScoreDisplay = ({ winnerScore, loserScore, winnerUsername }: MatchScoreDisplayProps) => {
  const formatScore = (score: string) => {
    return score.replace('-', ' - ');
  };

  return (
    <p className="text-sm mb-3">
      Score: {formatScore(winnerScore)} | {formatScore(loserScore)}
      <br />
      Winner: {winnerUsername}
    </p>
  );
};