
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Trophy, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface League {
  id: string;
  name: string;
}

interface SearchHeaderProps {
  onSearch: (leagueId: string) => void;
  activeTab?: 'leagues' | 'duos';
  onTabChange?: (tab: 'leagues' | 'duos') => void;
}

export const SearchHeader = ({ onSearch, activeTab = 'leagues', onTabChange }: SearchHeaderProps) => {
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
      const tableName = activeTab === 'duos' ? 'duo_leagues' : 'leagues';
      const participantsTable = activeTab === 'duos' ? 'duo_league_participants' : 'league_participants';
      
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          ${participantsTable} (
            id
          )
        `)
        .ilike('name', `%${value}%`)
        .order('name')
        .limit(10);
      
      if (error) {
        toast.error(`Failed to fetch ${activeTab}`);
        throw error;
      }
      
      setSuggestions(data || []);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
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
      {onTabChange && (
        <div className="flex items-center space-x-2 mb-4">
          <button 
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
              activeTab === 'leagues' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            )}
            onClick={() => onTabChange('leagues')}
          >
            <Trophy className="h-4 w-4 inline mr-2" />
            Leagues
          </button>
          <button 
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
              activeTab === 'duos' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            )}
            onClick={() => onTabChange('duos')}
          >
            <Users2 className="h-4 w-4 inline mr-2" />
            Duo Tournaments
          </button>
        </div>
      )}
      
      <div className="relative flex-1">
        <div className="relative">
          <Input
            type="text"
            placeholder={`Search ${activeTab === 'duos' ? 'duo tournaments' : 'leagues'}...`}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 pl-4 pr-12 text-left font-normal bg-white/80 border-blue-100 focus-visible:ring-blue-400"
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={() => onSearch(searchValue)}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
            <ul className="py-1 max-h-60 overflow-auto">
              {suggestions.map((league) => (
                <li
                  key={league.id}
                  onClick={() => handleSelect(league)}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm"
                >
                  {league.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {isLoading && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2 text-blue-500 text-sm">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};
