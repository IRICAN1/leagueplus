import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
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
    <div className="mt-6">
      <Table className="w-full bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50">
            <TableHead className="w-[200px] font-semibold text-gray-700">Player</TableHead>
            {winnerSets.map((_, index) => (
              <TableHead key={index} className="text-center w-24 font-semibold text-gray-700">
                Set {index + 1}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-blue-50/30 transition-colors">
            <TableCell className="font-medium text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                <span className="font-semibold text-green-700">{winnerName}</span>
              </div>
            </TableCell>
            {winnerSets.map((score, index) => (
              <TableCell 
                key={index} 
                className="text-center font-bold text-green-600 bg-green-50/50"
              >
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                  {score}
                </div>
              </TableCell>
            ))}
          </TableRow>
          <TableRow className="hover:bg-blue-50/30 transition-colors">
            <TableCell className="font-medium text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                <span className="font-semibold text-red-700">{loserName}</span>
              </div>
            </TableCell>
            {loserSets.map((score, index) => (
              <TableCell 
                key={index} 
                className="text-center font-bold text-red-600 bg-red-50/50"
              >
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 shadow-sm">
                  {score}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};