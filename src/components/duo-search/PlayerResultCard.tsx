import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Send, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PlayerResultCardProps {
  player: any;
  className?: string;
}

export const PlayerResultCard = ({ player, className }: PlayerResultCardProps) => {
  const navigate = useNavigate();

  const handleSendInvite = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login to send duo invites");
      navigate("/login");
      return;
    }

    try {
      const { error } = await supabase
        .from('duo_invites')
        .insert({
          sender_id: session.user.id,
          receiver_id: player.id,
          message: `Would you like to be my duo partner?`
        });

      if (error) throw error;

      toast.success("Duo invite sent successfully!");
    } catch (error: any) {
      toast.error("Failed to send duo invite");
      console.error("Error sending duo invite:", error);
    }
  };

  const stats = player.player_statistics?.[0] || {
    rank: '-',
    wins: 0,
    losses: 0,
    points: 0
  };

  return (
    <Card className={cn("p-4 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in", className)}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-blue-100">
            <AvatarImage src={player.avatar_url} />
            <AvatarFallback className="bg-blue-50 text-blue-600">
              {player.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {player.username || "Anonymous Player"}
            </h3>
            
            {player.primary_location && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{player.primary_location}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {stats.rank !== '-' && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                  <Trophy className="h-3 w-3 mr-1" />
                  Rank #{stats.rank}
                </Badge>
              )}
              <Badge variant="secondary" className="bg-green-50 text-green-600">
                {stats.wins} Wins
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                {stats.points} Points
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {player.availability_schedule && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Available: {player.weekday_preference || "Flexible"}</span>
            </div>
          )}

          <Button
            onClick={handleSendInvite}
            className="w-full md:w-auto"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Duo Invite
          </Button>
        </div>
      </div>
    </Card>
  );
};