
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface DuoTournamentStatusProps {
  id?: string;
  isLoading: boolean;
  error?: Error | null;
}

export const DuoTournamentStatus = ({ id, isLoading, error }: DuoTournamentStatusProps) => {
  if (!id) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Invalid tournament ID format.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>Error loading league details.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};
