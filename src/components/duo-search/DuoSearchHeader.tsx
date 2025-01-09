import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DuoSearchFilters } from "./DuoSearchFilters";
import { DuoSearchFilters as FilterType } from "@/pages/DuoSearch";

interface DuoSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
  showFilters: boolean;
}

export const DuoSearchHeader = ({ 
  searchQuery, 
  onSearchChange,
  filters,
  onFilterChange,
  showFilters
}: DuoSearchHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 text-base bg-white/90 backdrop-blur-sm border-blue-100 focus:border-blue-300 focus:ring-blue-200 transition-all shadow-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
      </div>
      <DuoSearchFilters 
        filters={filters} 
        onFilterChange={onFilterChange}
        showFilters={showFilters}
      />
    </div>
  );
};