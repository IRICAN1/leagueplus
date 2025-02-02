import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Users } from "lucide-react";

interface LocationParticipantsProps {
  form: UseFormReturn<any>;
  type?: 'single' | 'duo';
}

export const LocationParticipants = ({ form, type = 'single' }: LocationParticipantsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Location
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="max_participants"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Maximum {type === 'duo' ? 'Players' : 'Participants'}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={type === 'duo' ? 4 : 2}
                step={type === 'duo' ? 2 : 1}
                {...field} 
                onChange={e => field.onChange(+e.target.value)}
              />
            </FormControl>
            <FormDescription>
              {type === 'duo' 
                ? 'Enter the total number of players (must be even for duo pairs)' 
                : 'Enter the maximum number of participants'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};