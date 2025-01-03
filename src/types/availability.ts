import { Json } from "@/integrations/supabase/types";

export interface AvailabilitySchedule {
  selectedSlots: string[];
  [key: string]: Json | undefined;
}

export const isAvailabilitySchedule = (value: Json): value is AvailabilitySchedule => {
  if (!value || typeof value !== 'object') return false;
  if (!('selectedSlots' in value)) return false;
  if (!Array.isArray((value as any).selectedSlots)) return false;
  return (value as any).selectedSlots.every((slot: any) => typeof slot === 'string');
};