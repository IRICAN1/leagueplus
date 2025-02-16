
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/ResultCard";
import { calculateLeagueStatus } from "@/utils/leagueUtils";
import { DuoLeague, IndividualLeague, isDuoLeague, LeagueType } from "@/types/league";

interface LeaguesListProps {
  data: (DuoLeague | IndividualLeague)[];
  isLoading: boolean;
  leagueType: LeagueType;
  selectedLeagueId: string | null;
  page: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const LeaguesList = ({
  data,
  isLoading,
  leagueType,
  selectedLeagueId,
  page,
  onPageChange,
  itemsPerPage
}: LeaguesListProps) => {
  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading leagues...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No leagues found matching your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-in">
      {data.map((league) => (
        <ResultCard
          key={league.id}
          id={league.id}
          title={league.name}
          location={league.location}
          distance={0}
          date={format(new Date(league.start_date), 'MMMM d, yyyy')}
          type={calculateLeagueStatus(league.start_date, league.end_date)}
          sportType={league.sport_type}
          skillLevel={`${league.skill_level_min}-${league.skill_level_max}`}
          genderCategory={league.gender_category}
          participants={isDuoLeague(league) ? league.max_duo_pairs : league.max_participants}
          format={leagueType === 'duo' ? 'Team' : 'Individual'}
        />
      ))}
      {!selectedLeagueId && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(page + 1)}
            disabled={data.length < itemsPerPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
