import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leagueFormSchema } from "@/schemas/leagueSchema";
import { BasicInformation } from "@/components/league-form/BasicInformation";
import { DateFields } from "@/components/league-form/DateFields";
import { LocationParticipants } from "@/components/league-form/LocationParticipants";
import { FormatRules } from "@/components/league-form/FormatRules";
import { AdditionalDetails } from "@/components/league-form/AdditionalDetails";
import * as z from "zod";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CreateLeague = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showOptional, setShowOptional] = useState(false);

  const form = useForm<z.infer<typeof leagueFormSchema>>({
    resolver: zodResolver(leagueFormSchema),
    defaultValues: {
      format: "Individual",
      skill_level_min: 1,
      skill_level_max: 10,
      gender_category: "Mixed",
      match_format: "Single Matches",
      sport_type: "Tennis",
      max_participants: 2,
    },
  });

  const onSubmit = async (data: z.infer<typeof leagueFormSchema>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const formattedData = {
        creator_id: session.user.id,
        name: data.name,
        sport_type: data.sport_type,
        skill_level_min: data.skill_level_min,
        skill_level_max: data.skill_level_max,
        gender_category: data.gender_category,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        location: data.location,
        max_participants: data.max_participants,
        description: data.description,
        rules: data.rules,
        match_format: data.match_format,
        tournament_structure: data.tournament_structure,
        registration_deadline: data.registration_deadline.toISOString(),
        age_min: data.age_min,
        age_max: data.age_max,
        format: data.format,
        schedule_preferences: data.schedule_preferences,
        equipment_requirements: data.equipment_requirements,
        venue_details: data.venue_details,
      };

      const { error } = await supabase
        .from('leagues')
        .insert(formattedData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "League created successfully",
      });

      navigate("/");
    } catch (error) {
      console.error("Error creating league:", error);
      toast({
        title: "Error",
        description: "Failed to create league. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Create a New League</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Required Fields */}
          <div className="space-y-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold">Required Information</h2>
            <BasicInformation form={form} />
            <DateFields form={form} />
            <LocationParticipants form={form} />
          </div>

          {/* Optional Fields Toggle */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowOptional(!showOptional)}
          >
            {showOptional ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide Additional Options
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show Additional Options
              </>
            )}
          </Button>

          {/* Optional Fields */}
          {showOptional && (
            <div className="space-y-8 p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold">Additional Details</h2>
              <FormatRules form={form} />
              <AdditionalDetails form={form} />
            </div>
          )}

          <Button type="submit" className="w-full">
            Create League
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateLeague;