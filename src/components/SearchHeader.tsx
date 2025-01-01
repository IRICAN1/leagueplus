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
import { toast } from "sonner";

interface League {
  id: string;
  name: string;
}

interface SearchHeaderProps {
  onSearch: (leagueId: string) => void;
}

export const SearchHeader = ({ onSearch }: SearchHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data: leagues = [], isLoading } = useQuery({
    queryKey: ['leagues-search', searchValue],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('leagues')
          .select('id, name')
          .ilike('name', `%${searchValue}%`)
          .order('name')
          .limit(10);
        
        if (error) {
          toast.error('Failed to fetch leagues');
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching leagues:', error);
        return [];
      }
    },
    enabled: searchValue.length > 0,
  });

  const handleSelect = (leagueId: string) => {
    onSearch(leagueId);
    setOpen(false);
    setSearchValue("");
  };

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
                {searchValue || "Search leagues..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Type to search leagues..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-9"
                />
                <CommandEmpty>
                  {isLoading ? "Loading..." : "No leagues found."}
                </CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {leagues.map((league) => (
                    <CommandItem
                      key={league.id}
                      value={league.name}
                      onSelect={() => handleSelect(league.id)}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      <Search className="mr-2 h-4 w-4 text-blue-500" />
                      {league.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};