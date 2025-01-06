import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DuoSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  duos: any[];
  onSelect: (duoId: string) => void;
  leagueRequirements?: {
    skillLevel?: string;
    ageCategory?: string;
    genderCategory?: string;
  };
}

export const DuoSelectionDialog = ({
  isOpen,
  onClose,
  duos,
  onSelect,
  leagueRequirements
}: DuoSelectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Your Duo Partner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {duos.map((duo) => (
            <Card key={duo.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold">
                      {duo.player2.full_name || duo.player2.username}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">
                        {duo.duo_statistics?.[0]?.wins || 0} Wins
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {duo.player2.skill_level && (
                        <Badge variant="secondary">
                          Level {duo.player2.skill_level}
                        </Badge>
                      )}
                      {duo.player2.gender && (
                        <Badge variant="outline">
                          {duo.player2.gender}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 justify-center">
                  <Button 
                    onClick={() => onSelect(duo.id)}
                    className="w-full sm:w-auto"
                  >
                    Select Partner
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};