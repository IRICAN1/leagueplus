
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
  challengeType?: 'sent' | 'received';
};

export type DuoChallenge = Tables<"duo_match_challenges"> & {
  challenger_partnership: {
    id: string;
    player1: {
      id: string;
      username: string | null;
      avatar_url: string | null;
      full_name: string | null;
    };
    player2: {
      id: string;
      username: string | null;
      avatar_url: string | null;
      full_name: string | null;
    };
  };
  challenged_partnership: {
    id: string;
    player1: {
      id: string;
      username: string | null;
      avatar_url: string | null;
      full_name: string | null;
    };
    player2: {
      id: string;
      username: string | null;
      avatar_url: string | null;
      full_name: string | null;
    };
  };
  league: {
    name: string;
  };
  challengeType?: 'sent' | 'received';
};

export type ChallengeType = 'sent' | 'received';
