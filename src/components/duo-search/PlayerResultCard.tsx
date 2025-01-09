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
      "p-4 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300",
      "border-l-4 border-l-blue-500 hover:scale-[1.01]",
      className
    )}>
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-blue-100 ring-2 ring-blue-50">
          <AvatarImage src={player.avatar_url} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-semibold">
            {player.full_name?.[0]?.toUpperCase() || player.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {player.full_name || player.username}
              </h3>
              <p className="text-sm text-gray-500">{player.username}</p>
              {player.primary_location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{player.primary_location}</span>
                </div>
              )}
            </div>
            {stats.rank !== '-' && (
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-200">
                <Trophy className="h-3 w-3 mr-1" />
                Rank #{stats.rank}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <div className="flex items-center text-sm text-emerald-600">
              <Star className="h-4 w-4 mr-1" />
              <span>{stats.wins} Wins</span>
            </div>
            <div className="text-sm text-blue-600">
              {stats.points} Points
            </div>
            {player.skill_level && (
              <Badge variant="outline" className="bg-blue-50/50">
                Level {player.skill_level}
              </Badge>
            )}
            {player.weekday_preference && (
              <Badge variant="outline" className="bg-gray-50/80">
                <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                <span>{player.weekday_preference}</span>
              </Badge>
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              onClick={handleSendInvite}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Duo Invite
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};