
import { Card } from "@/components/ui/card";
import { Trophy, MapPin, Calendar, Users, Star } from "lucide-react";
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
        Loading tournaments...
      </div>
    );
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        No duo tournaments found. Try a different search or check back later!
      </div>
    );
  }

  const calculateTournamentStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {leagues.map((tournament) => {
          const status = calculateTournamentStatus(tournament.start_date, tournament.end_date);
          const teamCount = tournament.duo_league_participants?.length || 0;
          const spotsAvailable = tournament.max_duo_pairs - teamCount;
          
          return (
            <Card 
              key={tournament.id}
              className="overflow-hidden hover:shadow-md transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer animate-fade-in border-l-4 border-l-blue-400"
              onClick={() => navigate(`/duo-tournament/${tournament.id}`)}
            >
              <div className="p-4 bg-gradient-to-r from-blue-50/80 via-gray-50/80 to-blue-50/80">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`
                        ${status === 'active' ? 'bg-green-100 text-green-700' : 
                          status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'}
                      `}>
                        {status === 'active' ? 'Active' : 
                         status === 'upcoming' ? 'Upcoming' : 
                         'Completed'}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                        {tournament.sport_type}
                      </Badge>
                      <Badge variant="outline" className="bg-pink-50 border-pink-200 text-pink-700">
                        {tournament.gender_category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold">{tournament.name}</h3>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      {tournament.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>{tournament.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{format(new Date(tournament.start_date), 'MMM d')} - {format(new Date(tournament.end_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>{teamCount} / {tournament.max_duo_pairs} teams</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-blue-500" />
                        <span>Level {tournament.skill_level_min}-{tournament.skill_level_max}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Button
                      size="sm"
                      className="ml-auto flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/duo-tournament/${tournament.id}`);
                      }}
                    >
                      <Trophy className="h-4 w-4" />
                      View Tournament
                    </Button>
                  </div>
                </div>
                
                {status !== 'completed' && spotsAvailable > 0 && (
                  <div className="mt-3 text-sm text-green-600 font-medium">
                    {spotsAvailable} team spot{spotsAvailable > 1 ? 's' : ''} still available!
                  </div>
                )}
              </div>
            </Card>
          );
        })}
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
