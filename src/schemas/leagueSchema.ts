import * as z from "zod";

export const leagueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sport_type: z.enum(["Tennis", "Basketball", "Football", "Volleyball", "Badminton", "Padel"]),
  skill_level_min: z.number().min(1).max(10),
  skill_level_max: z.number().min(1).max(10),
  gender_category: z.enum(["Men", "Women", "Mixed"]),
  start_date: z.date(),
  end_date: z.date(),
  location: z.string().min(1, "Location is required"),
  max_participants: z.number().min(2),
  description: z.string().optional(),
  rules: z.string().optional(),
  match_format: z.enum(["Single Matches", "Round Robin", "Knockout"]),
  tournament_structure: z.string().optional(),
  registration_deadline: z.date(),
  age_min: z.number().optional(),
  age_max: z.number().optional(),
  format: z.enum(["Individual", "Team"]),
  schedule_preferences: z.string().optional(),
  equipment_requirements: z.string().optional(),
  venue_details: z.string().optional(),
  is_doubles: z.boolean().default(false),
  requires_duo: z.boolean().default(false),
}).refine((data) => {
  return data.start_date < data.end_date;
}, {
  message: "Start date must be before end date",
  path: ["start_date"],
}).refine((data) => {
  return data.skill_level_min <= data.skill_level_max;
}, {
  message: "Minimum skill level must be less than or equal to maximum skill level",
  path: ["skill_level_min"],
});