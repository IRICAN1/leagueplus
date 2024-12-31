import { User, Trophy, Award } from "lucide-react";
import type { PlayerData } from "@/types/player";

export const transformProfileToPlayerData = (profile: PlayerData) => {
  return {
    name: profile.full_name || profile.username || 'Unknown Player',
    rank: 0, // Default values since these aren't in the profile yet
    wins: 0,
    losses: 0,
    points: 0,
    achievements: [
      {
        title: "New Player",
        icon: Trophy
      },
      {
        title: "Active",
        icon: Award
      }
    ]
  };
};

export const transformLocationsToSelectableLocations = (locations: string[] = []) => {
  return locations.map((location, index) => ({
    id: String(index),
    name: location,
    distance: 'N/A'
  }));
};