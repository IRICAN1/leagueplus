
import { Button } from "@/components/ui/button";
import { Challenge, ChallengeType } from "@/types/match";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface ChallengeStatusProps {
  challenge: Challenge;
  type: ChallengeType;
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeStatus = ({ challenge, type, onResponse }: ChallengeStatusProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800"
  };

  const getStatusTranslation = (status: string) => {
    return t(`matches.${status}`);
  };

  const handleResponse = async (accept: boolean) => {
    if (onResponse) {
      onResponse(challenge.id, accept);
    }
  };

  return (
    <div className="flex flex-col items-end gap-4">
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[challenge.status]}`}>
        {getStatusTranslation(challenge.status)}
      </span>
      
      {type === 'received' && challenge.status === 'pending' && onResponse && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResponse(false)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {t('common.decline')}
          </Button>
          <Button
            size="sm"
            onClick={() => handleResponse(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {t('common.accept')}
          </Button>
        </div>
      )}
    </div>
  );
};
