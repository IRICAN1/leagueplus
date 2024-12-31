import { format } from "date-fns";
import { Award, Calendar, MapPin } from "lucide-react";
import { Challenge } from "@/types/match";

interface ChallengeDetailsProps {
  challenge: Challenge;
}

export const ChallengeDetails = ({ challenge }: ChallengeDetailsProps) => {
  return (
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
  );
};