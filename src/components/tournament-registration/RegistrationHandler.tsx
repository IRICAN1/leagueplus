
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DuoSelectionDialog } from "./DuoSelectionDialog";
import { toast } from "sonner";
import { RegistrationButton } from "./RegistrationButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, User } from "lucide-react";

interface RegistrationHandlerProps {
  leagueId: string;
  isDoubles?: boolean;
  requirements?: {
    skillLevel?: string;
    ageCategory?: string;
    genderCategory?: "Men" | "Women" | "Mixed";
  };
}

export const RegistrationHandler = ({
  leagueId,
  isDoubles,
  requirements,
}: RegistrationHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [duos, setDuos] = useState<any[]>([]);
  const [activeDuos, setActiveDuos] = useState<any[]>([]);
  const [canRegister, setCanRegister] = useState<boolean>(false);
  const navigate = useNavigate();

  const checkPlayerDuos = async (playerId: string) => {
    try {
      const { data: partnerships, error } = await supabase
        .from('duo_partnerships')
        .select('*')
        .or(`player1_id.eq.${playerId},player2_id.eq.${playerId}`)
        .eq('active', true);

      if (error) {
        console.error('Error checking duo partnerships:', error);
        return false;
      }

      return partnerships && partnerships.length > 0;
    } catch (error) {
      console.error('Error in checkPlayerDuos:', error);
      return false;
    }
  };

  const verifyRegistrationEligibility = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to register");
        return false;
      }

      const hasDuos = await checkPlayerDuos(user.id);
      if (!hasDuos) {
        toast.error("You need to have an active duo partnership to register for this tournament");
        return false;
      }

      const { data: tournament } = await supabase
        .from('duo_leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (!tournament) {
        toast.error("Tournament not found");
        return false;
      }

      if (new Date(tournament.registration_deadline) < new Date()) {
        toast.error("Registration deadline has passed");
        return false;
      }

      const { count } = await supabase
        .from('duo_league_participants')
        .select('*', { count: 'exact' })
        .eq('league_id', leagueId);

      if (count && tournament.max_duo_pairs && count >= tournament.max_duo_pairs) {
        toast.error("Tournament is full");
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking registration eligibility:', error);
      toast.error("Failed to verify registration eligibility");
      return false;
    }
  };

  useEffect(() => {
    const checkEligibility = async () => {
      const isEligible = await verifyRegistrationEligibility();
      setCanRegister(isEligible);
    };
    
    checkEligibility();
  }, [leagueId]);

  useEffect(() => {
    const fetchDuos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch active partnerships
        const { data: partnerships, error: partnershipError } = await supabase
          .from('duo_partnerships')
          .select(`
            *,
            player1:profiles!duo_partnerships_player1_id_fkey(*),
            player2:profiles!duo_partnerships_player2_id_fkey(*),
            duo_statistics(*)
          `)
          .or(`player1_id.eq.${user.id},player2_id.eq.${user.id}`)
          .eq('active', true);

        if (partnershipError) throw partnershipError;

        if (partnerships) {
          setActiveDuos(partnerships);

          // Check for existing registrations
          const { data: existingRegistrations } = await supabase
            .from('duo_league_participants')
            .select('duo_partnership_id')
            .eq('league_id', leagueId);

          const registeredDuoIds = new Set(
            existingRegistrations?.map(reg => reg.duo_partnership_id) || []
          );

          // Filter out already registered duos
          const availableDuos = partnerships.filter(
            duo => !registeredDuoIds.has(duo.id)
          );

          setDuos(availableDuos);
        }
      } catch (error) {
        console.error('Error fetching duos:', error);
        toast.error("Failed to fetch duo partnerships");
      }
    };

    fetchDuos();
  }, [leagueId]);

  const handleRegistration = async (duoId: string) => {
    try {
      setIsLoading(true);

      const isEligible = await verifyRegistrationEligibility();
      if (!isEligible) {
        return;
      }

      const { error: registrationError } = await supabase
        .from('duo_league_participants')
        .insert({
          league_id: leagueId,
          duo_partnership_id: duoId,
        });

      if (registrationError) throw registrationError;

      toast.success("Successfully registered for the tournament");
      navigate(`/tournament/${leagueId}`);
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Failed to register for the tournament");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activeDuos.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle>Your Active Partnerships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeDuos.map((duo) => {
              const stats = duo.duo_statistics?.[0] || { wins: 0, losses: 0, rank: '-' };
              const winRate = stats.wins + stats.losses > 0
                ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)
                : '0.0';

              return (
                <div
                  key={duo.id}
                  className="p-4 rounded-lg border border-blue-100 hover:border-blue-200 transition-all bg-white/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-blue-100">
                          <AvatarImage src={duo.player1.avatar_url} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <Avatar className="h-12 w-12 border-2 border-white ring-2 ring-purple-100">
                          <AvatarImage src={duo.player2.avatar_url} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {duo.player1.full_name || duo.player1.username} & {duo.player2.full_name || duo.player2.username}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Combined Skill: {Math.floor((duo.player1.skill_level + duo.player2.skill_level) / 2)}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Trophy className="h-4 w-4 text-blue-500" />
                            <span>{winRate}% Win Rate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Wins: <span className="text-green-600 font-medium">{stats.wins}</span>
                        {' '}/{' '}
                        Losses: <span className="text-red-600 font-medium">{stats.losses}</span>
                      </div>
                      {stats.rank !== 999999 && (
                        <Badge variant="outline" className="mt-1">
                          Rank #{stats.rank}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <RegistrationButton 
          onClick={() => setIsDialogOpen(true)} 
          disabled={!canRegister || isLoading}
        />
      </div>

      <DuoSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        duos={duos}
        onSelect={handleRegistration}
        leagueRequirements={{
          skillLevel: requirements?.skillLevel,
          ageCategory: requirements?.ageCategory,
          genderCategory: requirements?.genderCategory,
        }}
      />
    </div>
  );
};
