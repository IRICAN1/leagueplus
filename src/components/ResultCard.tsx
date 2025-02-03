import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  id: string;
  name: string;
  isDuoLeague: boolean;
  registrationOpen: boolean;
}

export const ResultCard = ({ id, name, isDuoLeague, registrationOpen }: ResultCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const route = isDuoLeague ? `/duo-tournament/${id}` : `/tournament/${id}`;
    navigate(route);
  };

  return (
    <Card className="p-4 cursor-pointer" onClick={handleClick}>
      <h2 className="text-lg font-bold">{name}</h2>
      {registrationOpen ? (
        <Badge variant="secondary">Registration Open</Badge>
      ) : (
        <Badge variant="destructive">Registration Closed</Badge>
      )}
      <Button className="mt-2" onClick={handleClick}>
        View Details
      </Button>
    </Card>
  );
};
