import { DuoSearchFilters as FilterType } from "@/pages/DuoSearch";
import { DuoSearchHeader } from "./DuoSearchHeader";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filters: FilterType;
  handleFilterChange: (newFilters: FilterType) => void;
  handleFilterReset: () => void;
  showFilters: boolean;
  className?: string; // Added className prop
}

export const SearchSection = ({
  searchQuery,
  setSearchQuery,
  filters,
  handleFilterChange,
  handleFilterReset,
  showFilters,
  className,
}: SearchSectionProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <DuoSearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFilterReset}
          className="hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
          title="Reset filters"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};