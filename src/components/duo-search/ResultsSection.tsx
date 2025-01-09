import { PlayerResultCard } from "./PlayerResultCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ResultsSectionProps {
  players: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  playersLoading: boolean;
}

export const ResultsSection = ({
  players,
  currentPage,
  setCurrentPage,
  totalPages,
  playersLoading,
}: ResultsSectionProps) => {
  if (playersLoading) {
    return (
      <div className="text-center py-8 text-gray-600">
        Loading players...
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        No players found matching your criteria.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player) => (
        <PlayerResultCard
          key={player.id}
          player={player}
          className="animate-slide-in"
        />
      ))}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="hover:bg-blue-50"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};