
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ActiveDuosList } from "@/components/duo-search/ActiveDuosList";
import { PendingInvites } from "@/components/duo-search/PendingInvites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WeeklySchedule } from "@/components/player-challenge/WeeklySchedule";
import { isAvailabilitySchedule } from "@/types/availability";
import { DuoNotifications } from "@/components/duo-search/DuoNotifications";

const MyDuos = () => {
  const [activeDuos, setActiveDuos] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    fetchDuoData();
  }, []);

  const fetchDuoData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch active partnerships
      const { data: partnerships, error: partnershipError } = await supabase
        .from('duo_partnerships')
        .select(`
          *,
          player1:profiles!duo_partnerships_player1_id_fkey(*),
          player2:profiles!duo_partnerships_player2_id_fkey(*),
          duo_statistics(*)
        `)
        .eq('active', true)
        .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`);

      if (partnershipError) throw partnershipError;
      setActiveDuos(partnerships || []);

      // Fetch pending invites
      const { data: invites, error: invitesError } = await supabase
        .from('duo_invites')
        .select(`
          *,
          sender:profiles!duo_invites_sender_id_fkey(*),
          receiver:profiles!duo_invites_receiver_id_fkey(*)
        `)
        .eq('status', 'pending')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (invitesError) throw invitesError;
      setPendingInvites(invites || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load duo partnerships and invites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const loadDuoAvailability = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: partnerships, error } = await supabase
        .from('duo_partnerships')
        .select('*')
        .eq('player1_id', user.id)
        .eq('active', true)
        .single();

      if (error) throw error;

      if (partnerships) {
        setCurrentDuoId(partnerships.id);
        if (partnerships.availability_schedule && 
            isAvailabilitySchedule(partnerships.availability_schedule)) {
          setSelectedTimeSlots(partnerships.availability_schedule.selectedSlots);
        } else {
          setSelectedTimeSlots([]);
        }
      }
    } catch (error) {
      console.error('Error loading duo availability:', error);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Duos</h1>
        <div className="flex items-center gap-2">
          <DuoNotifications />
          <button
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            onClick={() => {
              loadDuoAvailability();
              setShowSettings(true);
            }}
          >
            <Settings2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Duos</TabsTrigger>
          <TabsTrigger value="pending">Pending Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <ActiveDuosList 
            duos={activeDuos} 
            isLoading={isLoading} 
            onDuoUpdated={fetchDuoData}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingInvites 
            invites={pendingInvites} 
            isLoading={isLoading} 
            onInviteUpdated={fetchDuoData}
          />
        </TabsContent>
      </Tabs>

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

            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSaveAvailability}
            >
              Save Availability
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyDuos;
