import { Button } from "@/components/ui/button";
import { Challenge, ChallengeType } from "@/types/match";

interface ChallengeStatusProps {
  challenge: Challenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeStatus = ({ challenge, type, onResponse }: ChallengeStatusProps) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="flex flex-col items-end gap-4">
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[challenge.status]}`}>
        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
      </span>
      
      {type === 'received' && challenge.status === 'pending' && onResponse && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResponse(challenge.id, false)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => onResponse(challenge.id, true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
};