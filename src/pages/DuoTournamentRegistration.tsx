import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationHandler } from "@/components/tournament-registration/RegistrationHandler";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const DuoTournamentRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: league, isLoading } = useQuery({
    queryKey: ['duoLeague', id],
    queryFn: async () => {
      if (!id) throw new Error('No league ID provided');

      const { data, error } = await supabase
        .from('duo_leagues')
        .select(`
          *,
          creator:creator_id (
            username,
            full_name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('League not found');

      return {
        ...data,
        format: 'Team' as const,
        is_doubles: true,
        max_participants: data.max_duo_pairs * 2,
        requires_duo: true
      };
    }
  });

  if (!id) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Invalid tournament ID</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!league) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Tournament not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register for {league.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationHandler 
            leagueId={id} 
            isDoubles={true}
            requirements={{
              skillLevel: `${league.skill_level_min}-${league.skill_level_max}`,
              ageCategory: league.age_min ? `${league.age_min}+` : undefined,
              genderCategory: league.gender_category
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DuoTournamentRegistration;