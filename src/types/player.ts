export interface PlayerData {
  id: string;
  username: string;
  avatar_url?: string;
  full_name?: string;
  primary_location?: string;
  preferred_regions?: string[];
}

export interface PlayerProfileData {
  name: string;
  rank: number;
  wins: number;
  losses: number;
  points: number;
  achievements: Array<{
    title: string;
    icon: any;
  }>;
}