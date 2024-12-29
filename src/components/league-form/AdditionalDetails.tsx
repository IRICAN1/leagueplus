import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface AdditionalDetailsProps {
  form: UseFormReturn<any>;
}

export const AdditionalDetails = ({ form }: AdditionalDetailsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Additional Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="age_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Age</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(e.target.value ? +e.target.value : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age_max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Age</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(e.target.value ? +e.target.value : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="schedule_preferences"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Schedule Preferences</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter schedule preferences" 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="equipment_requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipment Requirements</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter equipment requirements" 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="venue_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Details</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter venue details" 
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};