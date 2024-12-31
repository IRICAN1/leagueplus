import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface PlayerAchievementBadgeProps {
  achievement: {
    title: string;
    icon: LucideIcon;
  };
}

export const PlayerAchievementBadge = ({ achievement }: PlayerAchievementBadgeProps) => {
  const Icon = achievement.icon;
  
  return (
    <Badge 
      variant="outline" 
      className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-600 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 animate-fade-in"
    >
      <Icon className="h-3 w-3 mr-1" />
      {achievement.title}
    </Badge>
  );
};