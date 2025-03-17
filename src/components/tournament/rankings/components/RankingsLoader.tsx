
import { Loader2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RankingsLoaderProps {
  isLoading: boolean;
  hasData: boolean;
}

export const RankingsLoader = ({ isLoading, hasData }: RankingsLoaderProps) => {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100">
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-blue-100">
        <CardContent className="p-8">
          <div className="text-center space-y-3">
            <Users className="h-12 w-12 text-blue-400 mx-auto opacity-50" />
            <div className="text-lg text-muted-foreground">
              No players found in this tournament.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
