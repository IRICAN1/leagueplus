
import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { useState } from "react";
import { LeagueFilters } from "@/types/league";
import { PublicDuoLeaguesList } from "@/components/leagues/PublicDuoLeaguesList";
import { useAllDuoLeagues } from "@/hooks/useAllDuoLeagues";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const LEAGUES_PER_PAGE = 10;

const Index = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeagueFilters>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const { t } = useTranslation();

  // Get all duo leagues for the public display - now with showAll parameter
  const { 
    data: duoLeaguesData, 
    isLoading: duoLeaguesLoading 
  } = useAllDuoLeagues(page, LEAGUES_PER_PAGE, true);

  const handleSearch = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<LeagueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedLeagueId(null);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <div className="container max-w-4xl mx-auto py-4 md:py-8 space-y-6 px-4 mt-16 md:mt-20">
        <div className="text-center space-y-4 mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text">
            {t('home.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        <SearchHeader 
          onSearch={handleSearch}
          showDuoOnly={true}
        />

        <div className="flex justify-center mb-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/all-duo-leagues">{t('league.viewAll')}</Link>
          </Button>
        </div>

        <PublicDuoLeaguesList
          leagues={duoLeaguesData?.leagues || []}
          isLoading={duoLeaguesLoading}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
          showPagination={false}
        />
      </div>
    </div>
  );
};

export default Index;
