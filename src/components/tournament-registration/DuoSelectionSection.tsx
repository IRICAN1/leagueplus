
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DuoSelectionSectionProps {
  isLoadingDuos: boolean;
  duos: any[];
  selectedDuo: string | null;
  onDuoSelect: (duoId: string) => void;
}

export const DuoSelectionSection = ({
  isLoadingDuos,
  duos,
  selectedDuo,
  onDuoSelect,
}: DuoSelectionSectionProps) => {
  if (isLoadingDuos) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (duos.length === 0) {
    return (
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          You need a duo partnership to join this league.
          You can find a duo partner in the Duo Search section.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4">
      {duos.map((duo) => (
        <Card
          key={duo.id}
          className={`p-4 cursor-pointer transition-all ${
            selectedDuo === duo.id 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onDuoSelect(duo.id)}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={duo.player2.avatar_url || "/placeholder.svg"}
                alt={duo.player2.username}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div>
              <h4 className="font-medium">{duo.player2.username}</h4>
              <p className="text-sm text-gray-500">
                Wins: {duo.duo_statistics[0]?.wins || 0} - 
                Losses: {duo.duo_statistics[0]?.losses || 0}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
