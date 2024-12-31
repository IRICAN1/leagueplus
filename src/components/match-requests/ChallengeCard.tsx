import { format } from "date-fns";
import { Award, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChallengeCardProps {
  challenge: any;
  type: 'sent' | 'received';
  onResponse?: (challengeId: string, accept: boolean) => void;
}

export const ChallengeCard = ({ challenge, type, onResponse }: ChallengeCardProps) => {
  const navigate = useNavigate();
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800"
  };

  const profile = type === 'sent' ? challenge.challenged : challenge.challenger;
  const profileId = type === 'sent' ? challenge.challenged_id : challenge.challenger_id;

  const handleProfileClick = () => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <Card key={challenge.id} className="p-6 mb-4 hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-blue-100 cursor-pointer hover:ring-blue-300 transition-all"
                  onClick={handleProfileClick}>
              <AvatarImage src={profile.avatar_url} />
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
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                {challenge.league.name}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                {format(new Date(challenge.proposed_time), 'PPp')}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                {challenge.location}
              </p>
            </div>
          </div>
        </div>
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
      </div>
    </Card>
  );
};