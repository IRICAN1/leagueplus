import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, X } from "lucide-react";
import { useState } from "react";

export const SearchHeader = () => {
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState([20]);

  return (
    <div className="w-full space-y-6 p-6 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 animate-fade-in hover:shadow-xl transition-all duration-300">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500">
            <MapPin className="h-5 w-5" />
          </div>
          <Input
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white/80"
          />
          {location && (
            <button
              onClick={() => setLocation("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <Button className="h-12 px-8 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 shadow-md hover:shadow-lg">
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