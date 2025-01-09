import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface MatchScoresTableProps {
  winnerName: string;
  loserName: string;
  winnerSets: string[];
  loserSets: string[];
}

export const MatchScoresTable = ({
  winnerName,
  loserName,
  winnerSets,
  loserSets,
}: MatchScoresTableProps) => {
  return (
    <div className="mt-3">
      <Table className="w-full bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 rounded-lg overflow-hidden border border-gray-100">
        <TableBody>
          <TableRow className="hover:bg-blue-50/30 transition-colors">
            <TableCell className="py-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="font-medium text-green-700">{winnerName}</span>
              </div>
            </TableCell>
            {winnerSets.map((score, index) => (
              <TableCell 
                key={index} 
                className="text-center py-1 text-xs font-medium text-green-600"
              >
                {score}
              </TableCell>
            ))}
          </TableRow>
          <TableRow className="hover:bg-blue-50/30 transition-colors">
            <TableCell className="py-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <span className="font-medium text-red-700">{loserName}</span>
              </div>
            </TableCell>
            {loserSets.map((score, index) => (
              <TableCell 
                key={index} 
                className="text-center py-1 text-xs font-medium text-red-600"
              >
                {score}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};