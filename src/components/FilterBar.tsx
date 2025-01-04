import { Button } from "@/components/ui/button";
import { RotateCcw, Filter, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { LeagueFilters } from "@/pages/Index";
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

  const filterContent = (
    <div className="space-y-4">
      <SportTypeFilter
        selectedSport={filters.sportType}
        onSportSelect={(sport) => onFilterChange({ sportType: sport })}
      />
      
      <FilterControls
        filters={filters}
        onFilterChange={onFilterChange}
      />
    </div>
  );

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2">
          <SportTypeFilter
            selectedSport={filters.sportType}
            onSportSelect={(sport) => onFilterChange({ sportType: sport })}
          />
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-white">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with additional filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
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
            className="bg-white"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-50 text-blue-600"
          title="Reset filters"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {!isMobile && isExpanded && (
        <div className="p-4 bg-gray-50/90 backdrop-blur-sm rounded-lg animate-slide-in shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200">
          <FilterControls
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
      )}
    </div>
  );
};