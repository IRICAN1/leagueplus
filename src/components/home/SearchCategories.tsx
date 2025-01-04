import { Button } from "@/components/ui/button";
import { Building, Trophy, Users2 } from "lucide-react";

export const SearchCategories = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Button
        variant="secondary"
        className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white border-2 border-yellow-300/50"
      >
        <Building className="h-8 w-8" />
        <span>Court à louer</span>
      </Button>
      <Button
        variant="secondary"
        className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white"
      >
        <Users2 className="h-8 w-8" />
        <span>Club</span>
      </Button>
      <Button
        variant="secondary"
        className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white"
      >
        <Trophy className="h-8 w-8" />
        <span>Compétition</span>
      </Button>
      <Button
        variant="secondary"
        className="flex flex-col items-center gap-2 p-6 bg-white/10 hover:bg-white/20 text-white"
      >
        <Users2 className="h-8 w-8" />
        <span>Championnat par équipe</span>
      </Button>
    </div>
  );
};