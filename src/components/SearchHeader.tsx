import { Input } from "@/components/ui/input";
import { useState } from "react";
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
    <div className="w-full space-y-6 p-4 md:p-6 bg-gradient-to-r from-gray-50/90 via-blue-50/90 to-gray-50/90 backdrop-blur-lg rounded-lg shadow-lg border border-blue-200 animate-fade-in hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search leagues..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full h-12 pl-4 pr-4 text-left font-normal bg-white/80"
        />
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
    </div>
  );
};