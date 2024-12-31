import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Challenge, ChallengeType } from "@/types/match";

interface ChallengeHeaderProps {
  challenge: Challenge;
  type: ChallengeType;
}

export const ChallengeHeader = ({ challenge, type }: ChallengeHeaderProps) => {
  const navigate = useNavigate();
  const profile = type === 'sent' ? challenge.challenged : challenge.challenger;
  const profileId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;

  const handleProfileClick = () => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <Avatar 
          className="h-12 w-12 ring-2 ring-offset-2 ring-blue-100 cursor-pointer hover:ring-blue-300 transition-all"
          onClick={handleProfileClick}
        >
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-medium">
            {profile.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'sent' 
              ? `Challenge to ${profile.username}`
              : `Challenge from ${profile.username}`}
          </h3>
          <button 
            onClick={handleProfileClick}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};