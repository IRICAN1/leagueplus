import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";

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
      <Table className="w-full bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        <TableBody>
          <TableRow className="hover:bg-blue-50/30 transition-colors">
            <TableCell className="py-1.5 text-xs">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="font-medium text-green-700 truncate">{winnerName}</span>
              </div>
            </TableCell>
            {winnerSets.map((score, index) => (
              <TableCell 
                key={index} 
                className="text-center py-1.5 text-sm font-semibold text-green-600 px-3 bg-green-50/30"
              >
                {score}
              </TableCell>
            ))}
          </TableRow>
          <TableRow className="hover:bg-blue-50/30 transition-colors">
            <TableCell className="py-1.5 text-xs">
              <div className="flex items-center gap-1.5 pl-6">
                <span className="font-medium text-red-700 truncate">{loserName}</span>
              </div>
            </TableCell>
            {loserSets.map((score, index) => (
              <TableCell 
                key={index} 
                className="text-center py-1.5 text-sm font-semibold text-red-600 px-3 bg-red-50/30"
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