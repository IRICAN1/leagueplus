import { Button } from "@/components/ui/button";
import { Square, SquareCheck } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SportTypeFilterProps {
  selectedSport?: string;
  onSportSelect: (sport: string) => void;
}

export const SportTypeFilter = ({ selectedSport, onSportSelect }: SportTypeFilterProps) => {
  const sportTypes = [
    { id: 'Tennis', label: 'Tennis' },
    { id: 'Padel', label: 'Padel' },
    { id: 'Badminton', label: 'Badminton' },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Label className="mr-2">Sport Type:</Label>
      {sportTypes.map((sport) => (
        <Button
          key={sport.id}
          variant="outline"
          className={`flex items-center gap-2 ${
            selectedSport === sport.id
              ? 'bg-blue-100 border-blue-300'
              : 'bg-white hover:bg-blue-50'
          }`}
          onClick={() => onSportSelect(selectedSport === sport.id ? undefined : sport.id)}
        >
          {selectedSport === sport.id ? (
            <SquareCheck className="h-4 w-4 text-blue-600" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          {sport.label}
        </Button>
      ))}
    </div>
  );
};