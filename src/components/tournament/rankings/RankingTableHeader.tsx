import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RankingTableHeaderProps {
  sortBy: "points" | "matches";
  requiresDuo?: boolean;
}

export const RankingTableHeader = ({ sortBy, requiresDuo }: RankingTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16">Rank</TableHead>
        <TableHead>{requiresDuo ? 'Team' : 'Player'}</TableHead>
        <TableHead className="text-right">Matches</TableHead>
        <TableHead className="text-right">Win Rate</TableHead>
        <TableHead className="text-right">Points</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};