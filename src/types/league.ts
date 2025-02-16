
import { Tables, Database } from "@/integrations/supabase/types";

export type LeagueFilters = {
  location?: string;
  sportType?: Database['public']['Enums']['league_sport_type'];
  skillLevel?: string;
  genderCategory?: Database['public']['Enums']['league_gender_category'];
  startDate?: Date;
  endDate?: Date;
  status?: 'active' | 'upcoming' | 'completed';
  hasSpots?: boolean;
};

export type LeagueType = 'individual' | 'duo';

export type DuoLeague = Tables<'duo_leagues'> & {
  duo_league_participants: { id: string }[];
};

export type IndividualLeague = Tables<'leagues'> & {
  league_participants: { id: string }[];
};

export const isDuoLeague = (league: DuoLeague | IndividualLeague): league is DuoLeague => {
  return 'max_duo_pairs' in league;
};
