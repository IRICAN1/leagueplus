
import { Crown, Medal, Trophy, Award } from "lucide-react";

interface RankDisplayProps {
  rank: number | '-';
}

export const RankDisplay = ({ rank }: RankDisplayProps) => {
  if (rank === '-') {
    return (
      <div className="font-medium text-muted-foreground">
        <Award className="h-5 w-5 text-gray-400 inline mr-1" />
        New
      </div>
    );
  }

  return (
    <div className="font-medium">
      {rank === 1 && (
        <Crown 
          className="h-5 w-5 text-yellow-500 inline mr-1 animate-pulse-soft"
          aria-label="First Place"
        />
      )}
      {rank === 2 && (
        <Medal 
          className="h-5 w-5 text-gray-400 inline mr-1"
          aria-label="Second Place"
        />
      )}
      {rank === 3 && (
        <Trophy 
          className="h-5 w-5 text-amber-500 inline mr-1"
          aria-label="Third Place"
        />
      )}
      {rank > 3 && (
        <Award 
          className="h-5 w-5 text-blue-400 inline mr-1"
          aria-label={`Rank ${rank}`}
        />
      )}
      #{rank}
    </div>
  );
};
