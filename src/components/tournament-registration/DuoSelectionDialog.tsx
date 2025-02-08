
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Trophy, Users2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  leagueRequirements,
}: DuoSelectionDialogProps) => {
  const [selectedDuo, setSelectedDuo] = useState<string | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 16 }, (_, timeIndex) => ({
      time: timeIndex + 8,
      available: true,
    })),
  }));

  const handleTimeSlotSelect = async (slots: string[]) => {
    setSelectedTimeSlots(slots);
  };

  const handleSelectAllDay = (day: number) => {
    const daySlots = availableTimeSlots[day].slots.map(slot => `${day}-${slot.time}`);
    const currentSelected = new Set(selectedTimeSlots);
    const isDayFullySelected = daySlots.every(slot => currentSelected.has(slot));
    
    let newSelectedSlots;
    if (isDayFullySelected) {
      newSelectedSlots = selectedTimeSlots.filter(slot => !daySlots.includes(slot));
    } else {
      newSelectedSlots = [...new Set([...selectedTimeSlots, ...daySlots])];
    }
    
    handleTimeSlotSelect(newSelectedSlots);
  };

  const handleDuoSelect = async (duoId: string) => {
    try {
      if (selectedTimeSlots.length === 0) {
        toast.error("Please select your duo's availability schedule");
        return;
      }

      const { error: updateError } = await supabase
        .from('duo_partnerships')
        .update({
          availability_schedule: {
            selectedSlots: selectedTimeSlots,
          },
        })
        .eq('id', duoId);

      if (updateError) throw updateError;

      onSelect(duoId);
      onClose();
    } catch (error: any) {
      toast.error("Failed to update duo availability");
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Partnership for Tournament</DialogTitle>
          <DialogDescription>
            Choose your duo partnership and set your availability schedule for tournament matches
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            {duos.map((duo) => (
              <Card
                key={duo.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedDuo === duo.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDuo(duo.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-blue-100">
                        <AvatarImage src={duo.player1.avatar_url} />
                        <AvatarFallback>{duo.player1.username?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-purple-100">
                        <AvatarImage src={duo.player2.avatar_url} />
                        <AvatarFallback>{duo.player2.username?.[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {duo.player1.full_name || duo.player1.username} & {duo.player2.full_name || duo.player2.username}
                        </h3>
                        <Badge variant="secondary" className="font-normal">
                          Combined Skill: {Math.floor((duo.player1.skill_level + duo.player2.skill_level) / 2)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>Wins: {duo.duo_statistics[0]?.wins || 0}</span>
                        </div>
                        <div>Losses: {duo.duo_statistics[0]?.losses || 0}</div>
                        {duo.duo_statistics[0]?.rank !== 999999 && (
                          <Badge variant="outline" className="bg-blue-50">
                            Rank #{duo.duo_statistics[0]?.rank}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedDuo === duo.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {selectedDuo && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users2 className="h-5 w-5" />
                  <span>Set your availability for tournament matches</span>
                </div>
                <WeeklySchedule
                  availableTimeSlots={availableTimeSlots}
                  selectedTimeSlots={selectedTimeSlots}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  onSelectAllDay={handleSelectAllDay}
                  isDuo={true}
                />

                <Button
                  className="w-full"
                  onClick={() => handleDuoSelect(selectedDuo)}
                  disabled={selectedTimeSlots.length === 0}
                >
                  <Users2 className="mr-2 h-4 w-4" />
                  Complete Registration with Selected Partnership
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
