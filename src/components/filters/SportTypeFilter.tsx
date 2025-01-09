import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

interface SportTypeFilterProps {
  selectedSport?: Database['public']['Enums']['league_sport_type'];
  onSportSelect: (sport: Database['public']['Enums']['league_sport_type']) => void;
}

export const SportTypeFilter = ({ selectedSport, onSportSelect }: SportTypeFilterProps) => {
  const sportTypes: Database['public']['Enums']['league_sport_type'][] = [
    'Tennis',
    'Padel',
    'Badminton'
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex flex-wrap gap-2">
        {sportTypes.map((sport) => {
          const isSelected = selectedSport === sport;
          return (
            <Button
              key={sport}
              variant={isSelected ? "default" : "outline"}
              className={`
                relative overflow-hidden transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                  : 'bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300'
                }
                ${isSelected ? 'scale-105' : 'scale-100'}
              `}
              onClick={() => onSportSelect(selectedSport === sport ? undefined : sport)}
            >
              <span className="relative z-10">{sport}</span>
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};