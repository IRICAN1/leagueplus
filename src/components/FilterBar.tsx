import { Button } from "@/components/ui/button";
import { RotateCcw, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { LeagueFilters } from "@/pages/Index";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SportTypeFilter } from "./filters/SportTypeFilter";
import { FilterControls } from "./filters/FilterControls";

interface FilterBarProps {
  onFilterChange: (filters: Partial<LeagueFilters>) => void;
  filters: LeagueFilters;
}

export const FilterBar = ({ onFilterChange, filters }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const handleReset = () => {
    onFilterChange({
      sportType: undefined,
      skillLevel: undefined,
      genderCategory: undefined,
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      hasSpots: undefined,
    });
  };

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="w-full animate-fade-in">
      <Button
        variant="outline"
        onClick={toggleExpanded}
        className="w-full md:hidden mb-2 flex items-center justify-between bg-white"
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      <div className={`${!isExpanded && isMobile ? 'hidden' : 'block'}`}>
        <div className="flex flex-wrap items-center gap-4 p-4 md:p-6 bg-gray-50/90 backdrop-blur-sm rounded-lg animate-slide-in shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200">
          <div className="flex-1 flex flex-wrap items-center gap-4">
            <SportTypeFilter
              selectedSport={filters.sportType}
              onSportSelect={(sport) => onFilterChange({ sportType: sport })}
            />
            
            <FilterControls
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-50 text-blue-600 w-full md:w-auto"
            title="Reset filters"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};