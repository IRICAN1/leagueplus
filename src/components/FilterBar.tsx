import { Button } from "@/components/ui/button";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { LeagueFilters } from "@/types/league";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SportTypeFilter } from "./filters/SportTypeFilter";
import { FilterControls } from "./filters/FilterControls";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex items-center gap-3">
          <SportTypeFilter
            selectedSport={filters.sportType}
            onSportSelect={(sport) => onFilterChange({ sportType: sport })}
          />
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2 text-blue-600" />
                More Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Filters
                </SheetTitle>
                <SheetDescription>
                  Refine your search with additional filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterControls
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Button
            variant="outline"
            onClick={toggleExpanded}
            className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2 text-blue-600" />
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
          title="Reset filters"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {!isMobile && isExpanded && (
        <div className="p-6 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm rounded-lg animate-slide-up shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200">
          <FilterControls
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
      )}
    </div>
  );
};
