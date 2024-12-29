import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface LocationParticipantsProps {
  form: UseFormReturn<any>;
}

export const LocationParticipants = ({ form }: LocationParticipantsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Location and Participants</h2>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
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
            <FormLabel>Maximum Participants</FormLabel>
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