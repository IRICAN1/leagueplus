import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchHeaderProps {
  onLocationChange: (location: string) => void;
  locations: string[];
}

interface League {
  name: string;
}

export const SearchHeader = ({ onLocationChange, locations }: SearchHeaderProps) => {
  const [radius, setRadius] = useState([20]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: leagues = [], isLoading } = useQuery<League[]>({
    queryKey: ['leagues-search'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return (data as League[]) || [];
    },
  });

  const filteredLeagues = leagues.filter(league => 
    league.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 p-4 md:p-6 bg-gradient-to-r from-gray-50/90 via-blue-50/90 to-gray-50/90 backdrop-blur-lg rounded-lg shadow-lg border border-blue-200 animate-fade-in hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full h-12 justify-start text-left font-normal bg-white/80"
              >
                <Search className="mr-2 h-5 w-5 shrink-0 text-blue-500" />
                {searchValue ? searchValue : "Search leagues..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search leagues..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-9"
                />
                <CommandEmpty>No league found.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {isLoading ? (
                    <div className="p-4 text-sm text-gray-500">Loading leagues...</div>
                  ) : (
                    filteredLeagues.map((league) => (
                      <CommandItem
                        key={league.name}
                        value={league.name}
                        onSelect={(currentValue) => {
                          setSearchValue(currentValue);
                          setOpen(false);
                        }}
                        className="cursor-pointer hover:bg-blue-50"
                      >
                        {league.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative md:w-1/3">
          <Select onValueChange={onLocationChange}>
            <SelectTrigger className="h-12 pl-10 text-lg border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 text-gray-700">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                <MapPin className="h-5 w-5" />
              </div>
              <SelectValue placeholder="Select location..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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