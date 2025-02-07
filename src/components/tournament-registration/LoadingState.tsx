
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2">Loading...</span>
      </div>
    </div>
  );
};
