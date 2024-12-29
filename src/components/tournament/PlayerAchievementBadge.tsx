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
    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">
      <Icon className="h-3 w-3 mr-1" />
      {achievement.title}
    </Badge>
  );
};