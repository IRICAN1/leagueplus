import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TournamentHeaderProps {
  name: string;
}

export const TournamentHeader = ({ name }: TournamentHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="secondary" className="mb-2">
            Registration Open
          </Badge>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            {name}
          </CardTitle>
        </div>
      </div>
    </CardHeader>
  );
};