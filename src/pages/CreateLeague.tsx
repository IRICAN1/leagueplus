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
import { ChevronDown, ChevronUp, Trophy, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

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
      is_doubles: false,
      requires_duo: false,
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
        is_doubles: data.is_doubles,
        requires_duo: data.requires_duo,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-8 w-8 text-blue-600 animate-pulse-soft" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Create a New League
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Required Fields Section */}
            <div className="space-y-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100 animate-fade-in">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-blue-800">Required Information</h2>
                <span className="text-sm text-red-500">*</span>
              </div>
              <BasicInformation form={form} />
              <DateFields form={form} />
              <LocationParticipants form={form} />
            </div>

            {/* Optional Fields Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowOptional(!showOptional)}
              className={cn(
                "w-full transition-all duration-300 border-blue-200 hover:border-blue-300",
                showOptional && "bg-blue-50 border-blue-300"
              )}
            >
              {showOptional ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4 text-blue-600" />
                  Hide Additional Options
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4 text-blue-600" />
                  Show Additional Options
                </>
              )}
            </Button>

            {/* Optional Fields Section */}
            {showOptional && (
              <div className="space-y-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100 animate-fade-in">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-blue-800">Additional Details</h2>
                  <span className="text-sm text-blue-500">(Optional)</span>
                </div>
                <FormatRules form={form} />
                <AdditionalDetails form={form} />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg group"
            >
              <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
              Launch League
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateLeague;