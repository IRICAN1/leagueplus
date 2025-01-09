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
}

export const SearchSection = ({
  searchQuery,
  setSearchQuery,
  filters,
  handleFilterChange,
  handleFilterReset,
  showFilters,
}: SearchSectionProps) => {
  return (
    <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4 border border-blue-100 animate-fade-in">
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