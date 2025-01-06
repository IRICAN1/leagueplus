import { cn } from "@/lib/utils";

interface DuoSearchTabsProps {
  activeTab: 'search' | 'myDuos';
  onTabChange: (tab: 'search' | 'myDuos') => void;
}

export const DuoSearchTabs = ({ activeTab, onTabChange }: DuoSearchTabsProps) => {
  return (
    <div className="flex space-x-2 mb-6 sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm z-10">
      <button 
        className={cn(
          "flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200",
          activeTab === 'search' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        )}
        onClick={() => onTabChange('search')}
      >
        Find Partners
      </button>
      <button 
        className={cn(
          "flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200",
          activeTab === 'myDuos' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
        )}
        onClick={() => onTabChange('myDuos')}
      >
        My Duos
      </button>
    </div>
  );
};