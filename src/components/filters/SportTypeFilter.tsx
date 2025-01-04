import { Button } from "@/components/ui/button";
import { Tennis, Dumbbell, Trophy } from "lucide-react";
import { Label } from "@/components/ui/label";

interface SportTypeFilterProps {
  selectedSport?: string;
  onSportSelect: (sport: string) => void;
}

export const SportTypeFilter = ({ selectedSport, onSportSelect }: SportTypeFilterProps) => {
  const sportTypes = [
    { id: 'Tennis', label: 'Tennis', icon: Tennis },
    { id: 'Padel', label: 'Padel', icon: Trophy },
    { id: 'Badminton', label: 'Badminton', icon: Dumbbell },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Label className="text-sm font-medium text-gray-700">Sport:</Label>
      <div className="flex flex-wrap gap-2">
        {sportTypes.map((sport) => {
          const Icon = sport.icon;
          const isSelected = selectedSport === sport.id;
          return (
            <Button
              key={sport.id}
              variant={isSelected ? "default" : "outline"}
              className={`flex items-center gap-2 h-9 px-3 ${
                isSelected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white hover:bg-blue-50 border-blue-200'
              }`}
              onClick={() => onSportSelect(selectedSport === sport.id ? undefined : sport.id)}
            >
              <Icon className="h-4 w-4" />
              {sport.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};