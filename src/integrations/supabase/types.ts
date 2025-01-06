export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_admin: boolean | null
          last_read_at: string
          profile_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          last_read_at?: string
          profile_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          last_read_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      duo_invites: {
        Row: {
          created_at: string
          id: string
          message: string | null
          receiver_id: string
          sender_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id: string
          sender_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          receiver_id?: string
          sender_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "duo_invites_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duo_invites_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      duo_partnerships: {
        Row: {
          active: boolean | null
          availability_schedule: Json | null
          created_at: string
          id: string
          player1_id: string
          player2_id: string
        }
        Insert: {
          active?: boolean | null
          availability_schedule?: Json | null
          created_at?: string
          id?: string
          player1_id: string
          player2_id: string
        }
        Update: {
          active?: boolean | null
          availability_schedule?: Json | null
          created_at?: string
          id?: string
          player1_id?: string
          player2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "duo_partnerships_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "duo_partnerships_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      duo_statistics: {
        Row: {
          created_at: string
          id: string
          losses: number | null
          partnership_id: string
          updated_at: string
          wins: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          losses?: number | null
          partnership_id: string
          updated_at?: string
          wins?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          losses?: number | null
          partnership_id?: string
          updated_at?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "duo_statistics_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "duo_partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      league_participants: {
        Row: {
          duo_partnership_id: string | null
          id: string
          joined_at: string | null
          league_id: string | null
          user_id: string | null
        }
        Insert: {
          duo_partnership_id?: string | null
          id?: string
          joined_at?: string | null
          league_id?: string | null
          user_id?: string | null
        }
        Update: {
          duo_partnership_id?: string | null
          id?: string
          joined_at?: string | null
          league_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_participants_duo_partnership_id_fkey"
            columns: ["duo_partnership_id"]
            isOneToOne: false
            referencedRelation: "duo_partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_participants_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leagues: {
        Row: {
          age_max: number | null
          age_min: number | null
          created_at: string
          creator_id: string
          description: string | null
          end_date: string
          equipment_requirements: string | null
          format: Database["public"]["Enums"]["league_format"]
          gender_category: Database["public"]["Enums"]["league_gender_category"]
          id: string
          is_doubles: boolean | null
          location: string
          match_format: Database["public"]["Enums"]["league_match_format"]
          max_participants: number
          name: string
          registration_deadline: string
          rules: string | null
          schedule_preferences: string | null
          skill_level_max: number
          skill_level_min: number
          sport_type: Database["public"]["Enums"]["league_sport_type"]
          start_date: string
          tournament_structure: string | null
          updated_at: string
          venue_details: string | null
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          created_at?: string
          creator_id: string
          description?: string | null
          end_date: string
          equipment_requirements?: string | null
          format?: Database["public"]["Enums"]["league_format"]
          gender_category: Database["public"]["Enums"]["league_gender_category"]
          id?: string
          is_doubles?: boolean | null
          location: string
          match_format: Database["public"]["Enums"]["league_match_format"]
          max_participants: number
          name: string
          registration_deadline: string
          rules?: string | null
          schedule_preferences?: string | null
          skill_level_max: number
          skill_level_min: number
          sport_type: Database["public"]["Enums"]["league_sport_type"]
          start_date: string
          tournament_structure?: string | null
          updated_at?: string
          venue_details?: string | null
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          created_at?: string
          creator_id?: string
          description?: string | null
          end_date?: string
          equipment_requirements?: string | null
          format?: Database["public"]["Enums"]["league_format"]
          gender_category?: Database["public"]["Enums"]["league_gender_category"]
          id?: string
          is_doubles?: boolean | null
          location?: string
          match_format?: Database["public"]["Enums"]["league_match_format"]
          max_participants?: number
          name?: string
          registration_deadline?: string
          rules?: string | null
          schedule_preferences?: string | null
          skill_level_max?: number
          skill_level_min?: number
          sport_type?: Database["public"]["Enums"]["league_sport_type"]
          start_date?: string
          tournament_structure?: string | null
          updated_at?: string
          venue_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leagues_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_challenges: {
        Row: {
          challenged_id: string
          challenger_id: string
          created_at: string | null
          id: string
          league_id: string
          location: string
          loser_score: string | null
          loser_score_set3: string | null
          proposed_time: string
          result_status: string | null
          status: string
          updated_at: string | null
          winner_id: string | null
          winner_score: string | null
          winner_score_set3: string | null
        }
        Insert: {
          challenged_id: string
          challenger_id: string
          created_at?: string | null
          id?: string
          league_id: string
          location: string
          loser_score?: string | null
          loser_score_set3?: string | null
          proposed_time: string
          result_status?: string | null
          status?: string
          updated_at?: string | null
          winner_id?: string | null
          winner_score?: string | null
          winner_score_set3?: string | null
        }
        Update: {
          challenged_id?: string
          challenger_id?: string
          created_at?: string | null
          id?: string
          league_id?: string
          location?: string
          loser_score?: string | null
          loser_score_set3?: string | null
          proposed_time?: string
          result_status?: string | null
          status?: string
          updated_at?: string | null
          winner_id?: string | null
          winner_score?: string | null
          winner_score_set3?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_challenges_challenged_id_fkey"
            columns: ["challenged_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_challenges_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_challenges_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_history: {
        Row: {
          created_at: string | null
          id: string
          league_id: string | null
          match_date: string | null
          opponent_id: string | null
          player_id: string | null
          points_earned: number
          position_played: string | null
          result: Database["public"]["Enums"]["match_result"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          match_date?: string | null
          opponent_id?: string | null
          player_id?: string | null
          points_earned?: number
          position_played?: string | null
          result: Database["public"]["Enums"]["match_result"]
        }
        Update: {
          created_at?: string | null
          id?: string
          league_id?: string | null
          match_date?: string | null
          opponent_id?: string | null
          player_id?: string | null
          points_earned?: number
          position_played?: string | null
          result?: Database["public"]["Enums"]["match_result"]
        }
        Relationships: [
          {
            foreignKeyName: "match_history_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_edited: boolean | null
          sender_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          sender_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_edited?: boolean | null
          sender_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_match_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_match_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_match_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_statistics: {
        Row: {
          availability_schedule: Json | null
          created_at: string | null
          id: string
          league_id: string | null
          losses: number
          matches_played: number
          player_id: string | null
          points: number
          preferred_position: string | null
          rank: number
          updated_at: string | null
          wins: number
        }
        Insert: {
          availability_schedule?: Json | null
          created_at?: string | null
          id?: string
          league_id?: string | null
          losses?: number
          matches_played?: number
          player_id?: string | null
          points?: number
          preferred_position?: string | null
          rank?: number
          updated_at?: string | null
          wins?: number
        }
        Update: {
          availability_schedule?: Json | null
          created_at?: string | null
          id?: string
          league_id?: string | null
          losses?: number
          matches_played?: number
          player_id?: string | null
          points?: number
          preferred_position?: string | null
          rank?: number
          updated_at?: string | null
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_statistics_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_statistics_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_category: string | null
          availability_schedule: Json | null
          avatar_url: string | null
          created_at: string
          favorite_venues: string[] | null
          full_name: string | null
          gender: string | null
          id: string
          max_travel_distance: number | null
          preferred_regions: string[] | null
          primary_location: string | null
          skill_level: number | null
          updated_at: string
          username: string | null
          weekday_preference: string | null
        }
        Insert: {
          age_category?: string | null
          availability_schedule?: Json | null
          avatar_url?: string | null
          created_at?: string
          favorite_venues?: string[] | null
          full_name?: string | null
          gender?: string | null
          id: string
          max_travel_distance?: number | null
          preferred_regions?: string[] | null
          primary_location?: string | null
          skill_level?: number | null
          updated_at?: string
          username?: string | null
          weekday_preference?: string | null
        }
        Update: {
          age_category?: string | null
          availability_schedule?: Json | null
          avatar_url?: string | null
          created_at?: string
          favorite_venues?: string[] | null
          full_name?: string | null
          gender?: string | null
          id?: string
          max_travel_distance?: number | null
          preferred_regions?: string[] | null
          primary_location?: string | null
          skill_level?: number | null
          updated_at?: string
          username?: string | null
          weekday_preference?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      recalculate_all_player_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      challenge_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "completed"
        | "approved"
        | "disputed"
      league_format: "Individual" | "Team"
      league_gender_category: "Men" | "Women" | "Mixed"
      league_match_format: "Single Matches" | "Round Robin" | "Knockout"
      league_sport_type:
        | "Tennis"
        | "Basketball"
        | "Football"
        | "Volleyball"
        | "Badminton"
        | "Padel"
      match_result: "win" | "loss" | "draw"
      result_approval_status: "pending" | "approved" | "disputed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
