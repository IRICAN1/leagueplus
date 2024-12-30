import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Trophy, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BasicInformationProps {
  form: UseFormReturn<any>;
}

export const BasicInformation = ({ form }: BasicInformationProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>League Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter league name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sport_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              Sport Type
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Tennis">Tennis</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
                <SelectItem value="Football">Football</SelectItem>
                <SelectItem value="Volleyball">Volleyball</SelectItem>
                <SelectItem value="Badminton">Badminton</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="skill_level_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Skill Level</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={10} {...field} onChange={e => field.onChange(+e.target.value)} />
              </FormControl>
              <FormDescription>Scale of 1-10</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skill_level_max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Skill Level</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={10} {...field} onChange={e => field.onChange(+e.target.value)} />
              </FormControl>
              <FormDescription>Scale of 1-10</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="gender_category"
        render={({ field }) => (
          <FormItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <FormLabel className="flex items-center gap-2 cursor-help">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Gender Category
                  </FormLabel>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select the gender category for this league</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Men">Men</SelectItem>
                <SelectItem value="Women">Women</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};