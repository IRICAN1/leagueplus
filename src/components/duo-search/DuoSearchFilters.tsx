import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DuoSearchFilters as FilterType } from "@/pages/DuoSearch";

interface DuoSearchFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
}

export const DuoSearchFilters = ({ filters, onFilterChange }: DuoSearchFiltersProps) => {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Skill Level</Label>
          <Select
            value={filters.skillLevel}
            onValueChange={(value) => onFilterChange({ skillLevel: value })}
          >
            <SelectTrigger>
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
          <Label>Gender</Label>
          <Select
            value={filters.gender}
            onValueChange={(value) => onFilterChange({ gender: value })}
          >
            <SelectTrigger>
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
          <Label>Age Category</Label>
          <Select
            value={filters.ageCategory}
            onValueChange={(value) => onFilterChange({ ageCategory: value })}
          >
            <SelectTrigger>
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
    </Card>
  );
};