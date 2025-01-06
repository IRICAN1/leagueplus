import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MessageSquare, Trophy, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isAvailabilitySchedule } from "@/types/availability";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";

interface ActiveDuosListProps {
  duos: any[];
  isLoading: boolean;
  onDuoUpdated: () => void;
}

export const ActiveDuosList = ({ duos, isLoading, onDuoUpdated }: ActiveDuosListProps) => {
  const [dissolvingDuoId, setDissolvingDuoId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [currentDuoId, setCurrentDuoId] = useState<string | null>(null);
  const { toast } = useToast();

  const availableTimeSlots = Array.from({ length: 7 }, (_, dayIndex) => ({
    day: dayIndex,
    slots: Array.from({ length: 16 }, (_, timeIndex) => ({
      time: timeIndex + 8,
      available: true,
    })),
  }));

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleDissolveDuo = async (duoId: string) => {
    try {
      const { error } = await supabase
        .from('duo_partnerships')
        .update({ active: false })
        .eq('id', duoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Duo partnership has been dissolved",
      });
      onDuoUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to dissolve duo partnership",
        variant: "destructive",
      });
    }
    setDissolvingDuoId(null);
  };

  const loadDuoAvailability = async (duoId: string) => {
    try {
      const { data: partnership, error } = await supabase
        .from('duo_partnerships')
        .select('*')
        .eq('id', duoId)
        .single();

      if (error) throw error;

      if (partnership) {
        setCurrentDuoId(partnership.id);
        if (partnership.availability_schedule && 
            isAvailabilitySchedule(partnership.availability_schedule)) {
          setSelectedTimeSlots(partnership.availability_schedule.selectedSlots);
        } else {
          setSelectedTimeSlots([]);
        }
      }
    } catch (error) {
      console.error('Error loading duo availability:', error);
      toast({
        title: "Error",
        description: "Failed to load duo availability",
        variant: "destructive",
      });
    }
  };

  const handleSaveAvailability = async () => {
    try {
      if (!currentDuoId) {
        toast({
          title: "Error",
          description: "No active duo partnership found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('duo_partnerships')
        .update({
          availability_schedule: {
            selectedSlots: selectedTimeSlots,
          },
        })
        .eq('id', currentDuoId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Duo availability updated successfully",
      });
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving duo availability:', error);
      toast({
        title: "Error",
        description: "Failed to update duo availability",
        variant: "destructive",
      });
    }
  };

  const handleTimeSlotSelect = (slots: string[]) => {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (duos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          You don't have any active duo partnerships yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {duos.map((duo) => {
        const partner = duo.player1.id === currentUserId ? duo.player2 : duo.player1;
        const stats = duo.duo_statistics[0];

        return (
          <Card key={duo.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={partner.avatar_url || "/placeholder.svg"}
                  alt={partner.username}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{partner.username}</h3>
                  <p className="text-sm text-gray-500">
                    Partners since {format(new Date(duo.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    loadDuoAvailability(duo.id);
                    setShowSettings(true);
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Availability
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Dissolve
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Dissolve Duo Partnership</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to dissolve this duo partnership? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDissolveDuo(duo.id)}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 rounded-lg p-3">
                  <Trophy className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <div className="text-lg font-semibold">{stats?.wins || 0}</div>
                  <div className="text-sm text-gray-500">Wins</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-semibold">{stats?.losses || 0}</div>
                  <div className="text-sm text-gray-500">Losses</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-semibold">
                    {stats ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Win Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Duo Availability Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <WeeklySchedule
              availableTimeSlots={availableTimeSlots}
              selectedTimeSlots={selectedTimeSlots}
              onTimeSlotSelect={handleTimeSlotSelect}
              onSelectAllDay={handleSelectAllDay}
              isDuo={true}
            />

            <Button
              className="w-full"
              onClick={handleSaveAvailability}
            >
              Save Availability
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};