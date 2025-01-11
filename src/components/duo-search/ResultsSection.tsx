import { PlayerResultCard } from "./PlayerResultCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface ResultsSectionProps {
  players: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  playersLoading: boolean;
  className?: string; // Added className prop
}

export const ResultsSection = ({
  players,
  currentPage,
  setCurrentPage,
  totalPages,
  playersLoading,
  className,
}: ResultsSectionProps) => {
  if (playersLoading) {
    return (
      <div className={cn("text-center py-8 text-gray-600", className)}>
        Loading players...
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm", className)}>
        No players found matching your criteria.
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
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
