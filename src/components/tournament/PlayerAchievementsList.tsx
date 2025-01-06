import { Trophy, Award, Medal, Crown, Star, Flame } from "lucide-react";
import { PlayerAchievementBadge } from "./PlayerAchievementBadge";
import { Achievement, Player } from "./types";

interface PlayerAchievementsListProps {
  player: Player;
}

export const PlayerAchievementsList = ({ player }: PlayerAchievementsListProps) => {
  const getPlayerAchievements = (player: Player): Achievement[] => {
    const achievements: Achievement[] = [];
    
    // Top 3 achievements
    if (player.rank === 1) achievements.push({ title: "Champion", icon: Crown });
    if (player.rank === 2) achievements.push({ title: "Runner Up", icon: Medal });
    if (player.rank === 3) achievements.push({ title: "Bronze", icon: Medal });
    
    // Win-based achievements
    if (player.wins >= 10) achievements.push({ title: "Victory Master", icon: Trophy });
    if (player.wins >= 5) achievements.push({ title: "Rising Star", icon: Star });
    
    // Points-based achievements
    if (player.points >= 100) achievements.push({ title: "Point Leader", icon: Flame });
    
    return achievements;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {getPlayerAchievements(player).map((achievement, index) => (
        <PlayerAchievementBadge
          key={index}
          achievement={achievement}
        />
      ))}
    </div>
  );
};