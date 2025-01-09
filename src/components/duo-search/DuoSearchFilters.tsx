import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DuoSearchFilters as FilterType } from "@/pages/DuoSearch";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DuoSearchFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
  showFilters: boolean;
}

export const DuoSearchFilters = ({ filters, onFilterChange, showFilters }: DuoSearchFiltersProps) => {
  const hasActiveFilters = filters.skillLevel || filters.gender || filters.ageCategory;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={`
            relative transition-all duration-300 h-10 w-10
            ${hasActiveFilters ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-white border-blue-100 hover:bg-blue-50'}
          `}
        >
          <SlidersHorizontal className={`h-4 w-4 ${hasActiveFilters ? 'text-blue-600' : 'text-gray-600'}`} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Filter Players
          </SheetTitle>
          <SheetDescription>
            Refine your search with additional filters
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-blue-800">Skill Level</Label>
            <Select
              value={filters.skillLevel}
              onValueChange={(value) => onFilterChange({ skillLevel: value })}
            >
              <SelectTrigger className="bg-white/90 border-blue-100 hover:border-blue-200 focus:border-blue-300 transition-colors">
                <SelectValue placeholder="Select skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">Beginner (1-3)</SelectItem>
                <SelectItem value="4-6">Intermediate (4-6)</SelectItem>
                <SelectItem value="7-10">Advanced (7-10)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-blue-800">Gender</Label>
            <Select
              value={filters.gender}
              onValueChange={(value) => onFilterChange({ gender: value })}
            >
              <SelectTrigger className="bg-white/90 border-blue-100 hover:border-blue-200 focus:border-blue-300 transition-colors">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-blue-800">Age Category</Label>
            <Select
              value={filters.ageCategory}
              onValueChange={(value) => onFilterChange({ ageCategory: value })}
            >
              <SelectTrigger className="bg-white/90 border-blue-100 hover:border-blue-200 focus:border-blue-300 transition-colors">
                <SelectValue placeholder="Select age category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46+">46+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};