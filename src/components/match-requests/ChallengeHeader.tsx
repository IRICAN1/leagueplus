
import { ExternalLink, ArrowLeftRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Challenge, ChallengeType } from "@/types/match";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex items-center gap-2">
      <Avatar 
        className="h-8 w-8 ring-1 ring-offset-1 ring-blue-100 cursor-pointer hover:ring-blue-300 transition-all overflow-hidden"
        onClick={handleProfileClick}
      >
        <AvatarImage 
          src={profile.avatar_url || undefined} 
          alt={profile.username}
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 font-medium text-xs">
          {profile.username?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-gray-900">
          {profile.username}
        </h3>
        <Badge 
          variant="outline" 
          className={`text-xs px-2 py-0 ${
            type === 'sent' 
              ? 'bg-blue-50 text-blue-600 border-blue-200' 
              : 'bg-purple-50 text-purple-600 border-purple-200'
          }`}
        >
          <ArrowLeftRight className="h-2.5 w-2.5 mr-1" />
          {type === 'sent' ? 'Sent' : 'Received'}
        </Badge>
        <button 
          onClick={handleProfileClick}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
