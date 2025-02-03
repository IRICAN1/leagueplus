import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LocationParticipantsProps {
  form: UseFormReturn<any>;
  maxParticipantsLabel?: string;
}

export const LocationParticipants = ({ form, maxParticipantsLabel = "Maximum Participants" }: LocationParticipantsProps) => {
  return (
    <div className="space-y-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h2 className="text-xl font-semibold flex items-center gap-2 cursor-help">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              Location and Participants
            </h2>
          </TooltipTrigger>
          <TooltipContent>
            <p>Specify where the league will take place and how many can join</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
              {maxParticipantsLabel}
            </FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={2} 
                {...field} 
                onChange={e => field.onChange(+e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};