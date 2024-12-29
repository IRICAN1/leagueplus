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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      league_format: "Individual" | "Team"
      league_gender_category: "Men" | "Women" | "Mixed"
      league_match_format: "Single Matches" | "Round Robin" | "Knockout"
      league_sport_type:
        | "Tennis"
        | "Basketball"
        | "Football"
        | "Volleyball"
        | "Badminton"
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
