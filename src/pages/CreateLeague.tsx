import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(3, "League name must be at least 3 characters"),
  sport_type: z.enum(["Tennis", "Basketball", "Football", "Volleyball", "Badminton"]),
  skill_level_min: z.coerce.number().min(1).max(10),
  skill_level_max: z.coerce.number().min(1).max(10),
  gender_category: z.enum(["Men", "Women", "Mixed"]),
  start_date: z.date(),
  end_date: z.date(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  max_participants: z.coerce.number().min(2, "Must have at least 2 participants"),
  description: z.string().optional(),
  rules: z.string().optional(),
  match_format: z.enum(["Single Matches", "Round Robin", "Knockout"]),
  tournament_structure: z.string().optional(),
  registration_deadline: z.date(),
  age_min: z.coerce.number().optional(),
  age_max: z.coerce.number().optional(),
  format: z.enum(["Individual", "Team"]),
  schedule_preferences: z.string().optional(),
  equipment_requirements: z.string().optional(),
  venue_details: z.string().optional(),
}).refine(data => data.skill_level_max >= data.skill_level_min, {
  message: "Maximum skill level must be greater than or equal to minimum skill level",
  path: ["skill_level_max"],
}).refine(data => data.end_date > data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
}).refine(data => data.start_date > data.registration_deadline, {
  message: "Start date must be after registration deadline",
  path: ["start_date"],
});

type FormValues = z.infer<typeof formSchema>;

const CreateLeague = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: "Individual",
      skill_level_min: 1,
      skill_level_max: 10,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from('leagues')
        .insert([{
          ...data,
          creator_id: session.user.id,
        }]);

      if (error) throw error;

      toast({
        title: "League created successfully!",
        description: "You will be redirected to the leagues page.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error creating league",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create a New League</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
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
                  <FormLabel>Sport Type</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="skill_level_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Skill Level (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skill_level_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Skill Level (1-10)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
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
                  <FormLabel>Gender Category</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || (form.getValues("registration_deadline") && date <= form.getValues("registration_deadline"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || (form.getValues("start_date") && date <= form.getValues("start_date"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="registration_deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Registration Deadline</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || (form.getValues("start_date") && date >= form.getValues("start_date"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    <Input type="number" min="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Detailed Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detailed Information</h2>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter league description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League Rules</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter league rules"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="match_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Match Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select match format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Single Matches">Single Matches</SelectItem>
                      <SelectItem value="Round Robin">Round Robin</SelectItem>
                      <SelectItem value="Knockout">Knockout</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tournament_structure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tournament Structure</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the tournament structure"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Settings</h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Age</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
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
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select league format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedule_preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter schedule preferences"
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating League..." : "Create League"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateLeague;