import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { BasicInformation } from "@/components/league-form/BasicInformation";
import { DateFields } from "@/components/league-form/DateFields";
import { LocationParticipants } from "@/components/league-form/LocationParticipants";
import { FormatRules } from "@/components/league-form/FormatRules";
import { AdditionalDetails } from "@/components/league-form/AdditionalDetails";
import { leagueFormSchema } from "@/schemas/leagueSchema";
import { Card } from "@/components/ui/card";

const CreateDuoLeague = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(leagueFormSchema),
    defaultValues: {
      format: "Team",
      is_doubles: true,
      requires_duo: true,
    },
  });

  const onSubmit = async (values: any) => {
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

      const { error } = await supabase.from("duo_leagues").insert({
        ...values,
        creator_id: session.session.user.id,
      });

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

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Duo League</h1>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BasicInformation form={form} />
            <DateFields form={form} />
            <LocationParticipants form={form} maxParticipantsLabel="Maximum Duo Pairs" />
            <FormatRules form={form} />
            <AdditionalDetails form={form} />
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