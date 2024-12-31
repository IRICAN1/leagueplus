import { Tables } from "@/integrations/supabase/types";

export type Challenge = Tables<"match_challenges", never> & {
  challenger: {
    username: string;
    avatar_url: string | null;
  };
  challenged: {
    username: string;
    avatar_url: string | null;
  };
  league: {
    name: string;
  };
};

export type ChallengeType = 'sent' | 'received';