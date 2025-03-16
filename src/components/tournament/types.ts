
import { LucideIcon } from "lucide-react";

export interface Achievement {
  title: string;
  icon: LucideIcon;
}

export interface Player {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  matches_played: number;
  achievements?: Achievement[];
  avatar_url?: string;
  avatar_url2?: string;
  // Added fields for duo partnerships
  player1_id?: string;
  player2_id?: string;
}
