import { Calendar, Trophy, Info } from "lucide-react";

interface TournamentInfoProps {
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  matchFormat: string;
  rules?: string;
}

export const TournamentInfo = ({
  registrationDeadline,
  startDate,
  endDate,
  matchFormat,
  rules,
}: TournamentInfoProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-600" />
          Important Dates
        </h3>
        <div className="text-sm space-y-1">
          <p>Registration Deadline: {new Date(registrationDeadline).toLocaleDateString()}</p>
          <p>Start Date: {new Date(startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(endDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-purple-600" />
          Tournament Format
        </h3>
        <p className="text-sm">{matchFormat}</p>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Info className="h-4 w-4 text-purple-600" />
          Rules
        </h3>
        <div className="text-sm space-y-1">
          {rules ? <p>{rules}</p> : <p>No specific rules provided</p>}
        </div>
      </div>
    </div>
  );
};