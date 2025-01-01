import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LeagueFilters } from "@/pages/Index";

interface FilterControlsProps {
  filters: LeagueFilters;
  onFilterChange: (filters: Partial<LeagueFilters>) => void;
}

export const FilterControls = ({ filters, onFilterChange }: FilterControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select onValueChange={(value) => onFilterChange({ skillLevel: value === "all" ? undefined : value })}>
        <SelectTrigger className="w-[180px] bg-white/90 text-gray-700 border-blue-100">
          <SelectValue placeholder="Skill Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="1-3">Beginner (1-3)</SelectItem>
          <SelectItem value="4-6">Intermediate (4-6)</SelectItem>
          <SelectItem value="7-10">Advanced (7-10)</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange({ genderCategory: value === "all" ? undefined : value })}>
        <SelectTrigger className="w-[180px] bg-white/90 text-gray-700 border-blue-100">
          <SelectValue placeholder="Gender Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Men">Men</SelectItem>
          <SelectItem value="Women">Women</SelectItem>
          <SelectItem value="Mixed">Mixed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value: 'active' | 'upcoming' | 'completed' | 'all') => 
        onFilterChange({ status: value === "all" ? undefined : value as 'active' | 'upcoming' | 'completed' })
      }>
        <SelectTrigger className="w-[180px] bg-white/90 text-gray-700 border-blue-100">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Switch
          id="has-spots"
          checked={filters.hasSpots}
          onCheckedChange={(checked) => onFilterChange({ hasSpots: checked })}
        />
        <Label htmlFor="has-spots">Available Spots</Label>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[180px] justify-start text-left font-normal bg-white/90 text-gray-700 border-blue-100"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate ? (
                format(filters.startDate, "PPP")
              ) : (
                <span>Start Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.startDate}
              onSelect={(date) => onFilterChange({ startDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full md:w-[180px] justify-start text-left font-normal bg-white/90 text-gray-700 border-blue-100"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate ? (
                format(filters.endDate, "PPP")
              ) : (
                <span>End Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate}
              onSelect={(date) => onFilterChange({ endDate: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};