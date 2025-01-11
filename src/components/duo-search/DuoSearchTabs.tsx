import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WeeklySchedule } from "../player-challenge/WeeklySchedule";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isAvailabilitySchedule } from "@/types/availability";

interface DuoSearchTabsProps {
  activeTab: 'search' | 'myDuos';
  onTabChange: (tab: 'search' | 'myDuos') => void;
  className?: string; // Added className prop
}

export const DuoSearchTabs = ({ activeTab, onTabChange }: DuoSearchTabsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [currentDuoId, setCurrentDuoId] = useState<string | null>(null);

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
        toast.error("No active duo partnership found");
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

      toast.success("Duo availability updated successfully");
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving duo availability:', error);
      toast.error("Failed to update duo availability");
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm z-10">
        <button 
          className={cn(
            "flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
            activeTab === 'search' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          )}
          onClick={() => onTabChange('search')}
        >
          Find Partners
        </button>
        <button 
          className={cn(
            "flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200",
            activeTab === 'myDuos' 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          )}
          onClick={() => onTabChange('myDuos')}
        >
          My Duos
        </button>
      </div>

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
    </>
  );
};
