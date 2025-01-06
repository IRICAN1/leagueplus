import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DuoSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DuoSearchHeader = ({ searchQuery, onSearchChange }: DuoSearchHeaderProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-transparent bg-clip-text">
          Tennis Duo System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find your perfect tennis partner or manage your existing partnerships
        </p>
      </div>
      <div className="relative max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Search for players..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-4 pr-12 h-12 text-lg shadow-sm"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};