import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlayerProfile } from "@/components/player-challenge/PlayerProfile";
import { ChallengeConfirmationDialog } from "@/components/player-challenge/ChallengeConfirmationDialog";
import { ChallengeForm } from "@/components/player-challenge/ChallengeForm";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { MapPin, Crown, Medal, Trophy, Star, Flame, Swords, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const PlayerChallenge = () => {
  const { playerId } = useParams();
  const location = useLocation();
  const { playerName, leagueId } = location.state || {};
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: playerData, isLoading, error } = useQuery({
    queryKey: ['player', playerId, leagueId],
    queryFn: async () => {
      if (!playerId || !leagueId) {
        throw new Error('Missing required parameters');
      }

      // Check if player exists first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', playerId)
        .maybeSingle();

      if (profileError) {
        console.error('Profile error:', profileError);
        throw new Error('Error fetching player profile');
      }

      if (!profileData) {
        throw new Error('Player not found. The profile may have been deleted or you may not have permission to view it.');
      }

      // Now get league data
      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('name')
        .eq('id', leagueId)
        .maybeSingle();

      if (leagueError) {
        console.error('League error:', leagueError);
        throw new Error('Error fetching league data');
      }

      if (!leagueData) {
        throw new Error('League not found. It may have been deleted or you may not have permission to view it.');
      }

      // Get player statistics
      const { data: statsData, error: statsError } = await supabase
        .from('player_statistics')
        .select(`
          *,
          league:league_id (
            name
          )
        `)
        .eq('player_id', playerId)
        .eq('league_id', leagueId)
        .maybeSingle();

      if (statsError) {
        console.error('Stats error:', statsError);
        // Don't throw error for stats, just use defaults
      }

      // Use the actual statistics from the database, defaulting to 0 if not found
      const stats = statsData || {
        rank: 999999,
        wins: 0,
        losses: 0,
        points: 0
      };

      return {
        ...profileData,
        name: profileData.full_name || profileData.username,
        rank: stats.rank,
        wins: stats.wins,
        losses: stats.losses,
        points: stats.points,
        leagueName: leagueData.name,
        leagueId,
        primary_location: profileData.primary_location
      };
    },
    retry: false
  });

  const handleChallenge = async () => {
    try {
      if (!playerData) {
        throw new Error('Player data not available');
      }

      const { error } = await supabase
        .from('match_challenges')
        .insert({
          league_id: leagueId,
          challenger_id: playerData?.id,
          challenged_id: playerId,
          proposed_time: getProposedTime(selectedTimeSlot[0]),
          location: playerData?.primary_location || "To be determined",
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Challenge Sent",
        description: "Your challenge request has been sent successfully.",
      });

      navigate('/match-requests');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send challenge request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'An error occurred while loading player data'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!playerData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Player not found. The profile may have been deleted or you may not have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }

  const playerDataWithAchievements = {
    ...playerData,
    achievements: getPlayerAchievements(playerData.rank, playerData.wins, playerData.points)
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <PlayerProfile player={playerDataWithAchievements} />
        
        {playerData.favorite_venues && playerData.favorite_venues.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Favorite Venues:</p>
            <div className="flex flex-wrap gap-2">
              {playerData.favorite_venues.map((venue, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {venue}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <ChallengeForm
          playerData={playerData}
          onOpenConfirmation={() => setIsConfirmationOpen(true)}
          onTimeSlotSelect={setSelectedTimeSlot}
          selectedTimeSlot={selectedTimeSlot}
        />
      </Card>

      <ChallengeConfirmationDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleChallenge}
        challengeDetails={{
          playerName: playerData.name,
          leagueName: playerData.leagueName,
          location: playerData.primary_location || "To be determined",
          proposedTime: getProposedTime(selectedTimeSlot[0]),
          leagueId: playerData.leagueId,
          playerId: playerId || '',
        }}
      />
    </div>
  );
};

const getPlayerAchievements = (rank: number, wins: number, points: number) => {
  const achievements = [];
  
  if (rank === 1) achievements.push({ title: "Champion", icon: Crown });
  if (rank === 2) achievements.push({ title: "Runner Up", icon: Medal });
  if (rank === 3) achievements.push({ title: "Bronze", icon: Trophy });
  if (wins >= 10) achievements.push({ title: "Victory Master", icon: Trophy });
  if (wins >= 5) achievements.push({ title: "Rising Star", icon: Star });
  if (points >= 100) achievements.push({ title: "Point Leader", icon: Flame });
  
  return achievements;
};

const getProposedTime = (timeSlot: string) => {
  if (!timeSlot) return new Date().toISOString();
  const [day, hour] = timeSlot.split('-').map(Number);
  const proposedDate = new Date();
  proposedDate.setDate(proposedDate.getDate() + ((7 + day - proposedDate.getDay()) % 7));
  proposedDate.setHours(hour, 0, 0, 0);
  return proposedDate.toISOString();
};

export default PlayerChallenge;
