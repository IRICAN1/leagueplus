import { Tables } from "@/integrations/supabase/types";

export type Challenge = Tables<"match_challenges"> & {
  challenger: {
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
  challenged: {
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
  league: {
    name: string;
  };
};

export type ChallengeType = 'sent' | 'received';

export type ChallengeStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'disputed';