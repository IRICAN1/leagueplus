import { SearchHeader } from "@/components/SearchHeader";
import { FilterBar } from "@/components/FilterBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useState } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchCategories } from "@/components/home/SearchCategories";
import { SearchResults } from "@/components/home/SearchResults";

const LEAGUES_PER_PAGE = 10;

export type LeagueFilters = {
  location?: string;
  sportType?: string;
  skillLevel?: string;
  genderCategory?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'upcoming' | 'completed';
  hasSpots?: boolean;
};

const Index = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<LeagueFilters>({});
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['leagues', page, filters, selectedLeagueId],
    queryFn: async () => {
      let query = supabase
        .from('leagues')
        .select('*, league_participants(count)')
        .order('created_at', { ascending: false });

      if (selectedLeagueId) {
        query = query.eq('id', selectedLeagueId);
      } else {
        query = query.range((page - 1) * LEAGUES_PER_PAGE, page * LEAGUES_PER_PAGE - 1);
      }

      if (filters.location) {
        query = query.eq('location', filters.location);
      }
      if (filters.sportType) {
        query = query.eq('sport_type', filters.sportType);
      }
      if (filters.skillLevel) {
        const [min, max] = filters.skillLevel.split('-').map(Number);
        query = query.gte('skill_level_min', min).lte('skill_level_max', max);
      }
      if (filters.genderCategory) {
        query = query.eq('gender_category', filters.genderCategory);
      }
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate.toISOString());
      }
      if (filters.status) {
        const now = new Date().toISOString();
        switch (filters.status) {
          case 'active':
            query = query.lte('start_date', now).gte('end_date', now);
            break;
          case 'upcoming':
            query = query.gt('start_date', now);
            break;
          case 'completed':
            query = query.lt('end_date', now);
            break;
        }
      }
      if (filters.hasSpots === true) {
        query = query.neq('league_participants.count', 'max_participants');
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as (Tables<'leagues', never> & { league_participants: { count: number }[] })[];
    },
  });

  if (error) {
    toast.error('Failed to load leagues');
  }

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900">
      <div className="container max-w-6xl mx-auto py-8 md:py-12 space-y-8 px-4">
        <HeroSection />
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Rechercher</h2>
          <SearchCategories />
          <SearchHeader onSearch={handleSearch} />
          <FilterBar 
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>

        <SearchResults 
          isLoading={isLoading}
          data={data}
          page={page}
          setPage={setPage}
          selectedLeagueId={selectedLeagueId}
          LEAGUES_PER_PAGE={LEAGUES_PER_PAGE}
        />
      </div>
    </div>
  );
};

export default Index;