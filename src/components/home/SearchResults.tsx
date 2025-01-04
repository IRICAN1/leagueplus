import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

interface SearchResultsProps {
  isLoading: boolean;
  data: (Tables<'leagues', never> & { league_participants: { count: number }[] })[] | null;
  page: number;
  setPage: (page: number) => void;
  selectedLeagueId: string | null;
  LEAGUES_PER_PAGE: number;
}

export const SearchResults = ({ 
  isLoading, 
  data, 
  page, 
  setPage, 
  selectedLeagueId,
  LEAGUES_PER_PAGE 
}: SearchResultsProps) => {
  return (
    <div className="space-y-4 animate-slide-in">
      {isLoading ? (
        <div className="text-center py-8 text-white">Loading leagues...</div>
      ) : data && data.length > 0 ? (
        <>
          {data.map((league) => (
            <ResultCard
              key={league.id}
              id={league.id}
              title={league.name}
              location={league.location}
              distance={0}
              date={format(new Date(league.start_date), 'MMMM d, yyyy')}
              type={league.format}
              sportType={league.sport_type}
              skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
              genderCategory={league.gender_category}
              participants={league.max_participants}
            />
          ))}
          {!selectedLeagueId && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(p => p + 1)}
                disabled={data.length < LEAGUES_PER_PAGE}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-white">
          No leagues found matching your criteria.
        </div>
      )}
    </div>
  );
};