import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateFields } from "@/components/league-form/DateFields";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";

const duoLeagueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sport_type: z.enum(["Tennis", "Padel", "Badminton"]),
  gender_category: z.enum(["Men", "Women", "Mixed"]),
  start_date: z.date(),
  end_date: z.date(),
  registration_deadline: z.date(),
  location: z.string().min(1, "Location is required"),
  max_duo_pairs: z.number().min(2),
  description: z.string().optional(),
  rules: z.string().optional(),
  format: z.literal("Team"),
  skill_level_min: z.number().default(1),
  skill_level_max: z.number().default(10),
  match_format: z.enum(["Single Matches", "Round Robin", "Knockout"]).default("Single Matches"),
}).refine((data) => {
  return data.start_date < data.end_date;
}, {
  message: "Start date must be before end date",
  path: ["start_date"],
});

type DuoLeagueFormValues = z.infer<typeof duoLeagueFormSchema>;

const CreateDuoLeague = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<DuoLeagueFormValues>({
    resolver: zodResolver(duoLeagueFormSchema),
    defaultValues: {
      format: "Team",
      skill_level_min: 1,
      skill_level_max: 10,
      match_format: "Single Matches",
    },
  });

  const onSubmit = async (values: DuoLeagueFormValues) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a league",
        });
        return;
      }

      const formattedValues = {
        ...values,
        creator_id: session.session.user.id,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        registration_deadline: values.registration_deadline.toISOString(),
        sport_type: values.sport_type,
        gender_category: values.gender_category,
        location: values.location,
        max_duo_pairs: values.max_duo_pairs,
        name: values.name,
        format: values.format,
        skill_level_min: values.skill_level_min,
        skill_level_max: values.skill_level_max,
        match_format: values.match_format,
      };

      const { error } = await supabase.from("duo_leagues").insert(formattedValues);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Duo league created successfully",
      });
      navigate("/my-leagues");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // ... keep existing code (form JSX)

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Duo League</h1>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <SelectItem value="Padel">Padel</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <DateFields form={form} />

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
              name="max_duo_pairs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Duo Pairs</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={2} 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter league description" 
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
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter league rules" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Create Duo League
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateDuoLeague;
