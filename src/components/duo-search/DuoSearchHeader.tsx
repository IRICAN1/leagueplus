import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DuoSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DuoSearchHeader = ({ searchQuery, onSearchChange }: DuoSearchHeaderProps) => {
  return (
    <div className="relative flex-1">
      <Input
        type="text"
        placeholder="Search for players..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-4 pr-12 h-10 text-base shadow-sm bg-white"
      />
      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors">
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
};