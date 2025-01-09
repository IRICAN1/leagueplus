import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Send, Calendar, Star } from "lucide-react";
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
    <Card className={cn(
      "p-3 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300",
      "border-l-4 border-l-blue-500 hover:scale-[1.01]",
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-12 w-12 border-2 border-blue-100 ring-2 ring-blue-50 flex-shrink-0">
            <AvatarImage src={player.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-semibold">
              {player.full_name?.[0]?.toUpperCase() || player.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {player.full_name || player.username}
              </h3>
              {stats.rank !== '-' && (
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200">
                  <Trophy className="h-3 w-3 mr-1" />
                  #{stats.rank}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {player.primary_location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-blue-500" />
                  <span className="truncate">{player.primary_location}</span>
                </div>
              )}
              <div className="flex items-center text-emerald-600">
                <Star className="h-3 w-3 mr-1" />
                <span>{stats.wins}</span>
              </div>
              {player.weekday_preference && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  <span className="truncate">{player.weekday_preference}</span>
                </div>
              )}
              {player.skill_level && (
                <Badge variant="outline" className="bg-blue-50/50">
                  Level {player.skill_level}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSendInvite}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </div>
    </Card>
  );
};