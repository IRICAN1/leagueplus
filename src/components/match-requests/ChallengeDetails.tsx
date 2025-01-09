import { format } from "date-fns";
import { Award, Calendar, MapPin } from "lucide-react";
import { Challenge } from "@/types/match";

interface ChallengeDetailsProps {
  challenge: Challenge;
}

export const ChallengeDetails = ({ challenge }: ChallengeDetailsProps) => {
  return (
    <div className="flex gap-3 text-xs text-gray-600">
      <span className="flex items-center gap-1">
        <Award className="h-3 w-3 text-purple-500" />
        {challenge.league.name}
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="h-3 w-3 text-blue-500" />
        {format(new Date(challenge.proposed_time), 'PPp')}
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="h-3 w-3 text-red-500" />
        {challenge.location}
      </span>
    </div>
  );
};