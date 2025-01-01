import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
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

interface League {
  name: string;
}

interface SearchHeaderProps {
  onLocationChange: (location: string) => void;
  locations: string[];
}

export const SearchHeader = ({ onLocationChange, locations }: SearchHeaderProps) => {
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
      return data || [];
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
      </div>
    </div>
  );
};