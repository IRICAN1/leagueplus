import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  id: string;
  name: string;
  isDuoLeague: boolean;
  registrationOpen: boolean;
  location?: string;
  distance?: number;
  date?: string;
  type?: string;
  sportType?: "Tennis" | "Basketball" | "Football" | "Volleyball" | "Badminton" | "Padel";
  skillLevel?: string;
  genderCategory?: "Men" | "Women" | "Mixed";
  participants?: number;
}

export const ResultCard = ({ 
  id, 
  name, 
  isDuoLeague, 
  registrationOpen,
  location,
  date,
  type,
  sportType,
  skillLevel,
  genderCategory,
  participants 
}: ResultCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const route = isDuoLeague ? `/duo-tournament/${id}` : `/tournament/${id}`;
    navigate(route);
  };

  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={handleClick}>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold">{name}</h2>
          {registrationOpen ? (
            <Badge variant="secondary">Registration Open</Badge>
          ) : (
            <Badge variant="destructive">Registration Closed</Badge>
          )}
        </div>

        {location && (
          <p className="text-sm text-muted-foreground">
            📍 {location}
          </p>
        )}

        {date && (
          <p className="text-sm text-muted-foreground">
            📅 {date}
          </p>
        )}

        {(sportType || type || skillLevel || genderCategory) && (
          <div className="flex flex-wrap gap-2">
            {sportType && <Badge variant="outline">{sportType}</Badge>}
            {type && <Badge variant="outline">{type}</Badge>}
            {skillLevel && <Badge variant="outline">Level {skillLevel}</Badge>}
            {genderCategory && <Badge variant="outline">{genderCategory}</Badge>}
          </div>
        )}

        {participants !== undefined && (
          <p className="text-sm text-muted-foreground">
            👥 {participants} participants
          </p>
        )}

        <Button className="w-full mt-2" onClick={handleClick}>
          View Details
        </Button>
      </div>
    </Card>
  );
};