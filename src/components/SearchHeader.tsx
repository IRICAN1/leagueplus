import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, X } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchHeaderProps {
  onLocationChange: (location: string) => void;
  locations: string[];
}

export const SearchHeader = ({ onLocationChange, locations }: SearchHeaderProps) => {
  const [radius, setRadius] = useState([20]);

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-r from-gray-50/90 via-blue-50/90 to-gray-50/90 backdrop-blur-lg rounded-lg shadow-lg border border-blue-200 animate-fade-in hover:shadow-xl transition-all duration-300">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Select onValueChange={onLocationChange}>
            <SelectTrigger className="h-12 pl-10 text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 text-gray-700">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <MapPin className="h-5 w-5" />
              </div>
              <SelectValue placeholder="Select location..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="h-12 px-8 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg">
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Radius</span>
          <span>{radius[0]} km</span>
        </div>
        <Slider
          value={radius}
          onValueChange={setRadius}
          max={100}
          step={1}
          className="py-4"
        />
      </div>
    </div>
  );
};