import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, CalendarDays } from "lucide-react";

interface League {
  id: string;
  name: string;
}

interface SearchHeaderProps {
  onSearch: (leagueId: string) => void;
}

export const SearchHeader = ({ onSearch }: SearchHeaderProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name')
        .ilike('name', `%${value}%`)
        .order('name')
        .limit(10);
      
      if (error) {
        toast.error('Failed to fetch leagues');
        throw error;
      }
      
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (league: League) => {
    onSearch(league.id);
    setSearchValue(league.name);
    setSuggestions([]);
  };

  return (
    <div className="w-full space-y-4 p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Localisation"
            className="w-full h-12 pl-10 pr-4 text-left font-normal bg-white/90"
          />
          <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
        </div>
        
        <div className="relative">
          <Input
            type="text"
            value="35 km"
            className="w-full h-12 pl-4 pr-4 text-left font-normal bg-white/90"
          />
        </div>

        <div className="relative">
          <Input
            type="text"
            value="04/01"
            className="w-full h-12 pl-10 pr-4 text-left font-normal bg-white/90"
          />
          <CalendarDays className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((league) => (
              <li
                key={league.id}
                onClick={() => handleSelect(league)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {league.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isLoading && (
        <div className="absolute right-3 top-3 text-blue-500">
          Loading...
        </div>
      )}
    </div>
  );
};