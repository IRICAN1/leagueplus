import { Crown, Medal } from "lucide-react";

interface RankDisplayProps {
  rank: number;
}

export const RankDisplay = ({ rank }: RankDisplayProps) => {
  return (
    <div className="font-medium">
      {rank === 1 && <Crown className="h-5 w-5 text-yellow-500 inline mr-1 animate-pulse-soft" />}
      {rank === 2 && <Medal className="h-5 w-5 text-gray-400 inline mr-1" />}
      {rank === 3 && <Medal className="h-5 w-5 text-amber-500 inline mr-1" />}
      #{rank}
    </div>
  );
};