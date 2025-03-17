
import { Card } from "@/components/ui/card";
import { Trophy, MapPin, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface PublicDuoLeaguesListProps {
  leagues: any[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PublicDuoLeaguesList = ({
  leagues,
  isLoading,
  currentPage,
  totalPages,
  onPageChange
}: PublicDuoLeaguesListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading leagues...
      </div>
    );
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        No duo leagues found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {leagues.map((league) => (
          <Card 
            key={league.id}
            className="p-4 hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer"
            onClick={() => navigate(`/duo-tournament/${league.id}`)}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{league.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  {league.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{league.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>{format(new Date(league.start_date), 'MMM d')} - {format(new Date(league.end_date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{league.duo_league_participants?.length || 0} / {league.max_duo_pairs} teams</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50">
                    {league.skill_level_min}-{league.skill_level_max} Skill
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50">
                    {league.gender_category}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    {league.sport_type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  size="sm"
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/duo-tournament/${league.id}`);
                  }}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Rankings
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = currentPage <= 3
                ? i + 1
                : currentPage >= totalPages - 2
                  ? totalPages - 4 + i
                  : currentPage - 2 + i;
              
              if (pageNumber <= 0 || pageNumber > totalPages) return null;
              
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNumber)}
                    isActive={currentPage === pageNumber}
                    className="hover:bg-blue-50"
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
