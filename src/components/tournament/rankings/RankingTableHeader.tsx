import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RankingTableHeaderProps {
  sortBy: "points" | "matches";
}

export const RankingTableHeader = ({ sortBy }: RankingTableHeaderProps) => (
  <TableHeader>
    <TableRow className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 hover:from-blue-100 hover:to-purple-100">
      <TableHead className="w-[100px]">Rank</TableHead>
      <TableHead>Player</TableHead>
      <TableHead>Achievements</TableHead>
      <TableHead className="text-right">
        {sortBy === "points" ? "W/L" : "Matches"}
      </TableHead>
      <TableHead className="text-right">
        {sortBy === "points" ? "Points" : "Win Rate"}
      </TableHead>
      <TableHead className="w-[100px]"></TableHead>
    </TableRow>
  </TableHeader>
);