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
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: number
          product_items: Json | null
          product_name: string
          product_price: number
          product_type: string
          product_unit: string | null
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: number
          product_items?: Json | null
          product_name: string
          product_price: number
          product_type: string
          product_unit?: string | null
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: number
          product_items?: Json | null
          product_name?: string
          product_price?: number
          product_type?: string
          product_unit?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_cart_items: {
        Row: {
          created_at: string
          group_session_id: string | null
          id: string
          product_id: number
          product_items: Json | null
          product_name: string
          product_price: number
          product_type: string
          product_unit: string | null
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          group_session_id?: string | null
          id?: string
          product_id: number
          product_items?: Json | null
          product_name: string
          product_price: number
          product_type: string
          product_unit?: string | null
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          group_session_id?: string | null
          id?: string
          product_id?: number
          product_items?: Json | null
          product_name?: string
          product_price?: number
          product_type?: string
          product_unit?: string | null
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_cart_items_group_session_id_fkey"
            columns: ["group_session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_session_id: string | null
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          group_session_id?: string | null
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          group_session_id?: string | null
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_session_id_fkey"
            columns: ["group_session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_sessions: {
        Row: {
          created_at: string
          discount_percentage: number
          group_type: string
          id: string
          is_public: boolean
          items: Json | null
          join_code: string
          leader_id: string
          max_participants: number
          min_participants: number
          name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percentage?: number
          group_type?: string
          id?: string
          is_public?: boolean
          items?: Json | null
          join_code: string
          leader_id: string
          max_participants?: number
          min_participants?: number
          name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percentage?: number
          group_type?: string
          id?: string
          is_public?: boolean
          items?: Json | null
          join_code?: string
          leader_id?: string
          max_participants?: number
          min_participants?: number
          name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          delivery_address: string
          delivery_date: string | null
          delivery_time_slot: string | null
          discount_applied: number | null
          discount_percentage: number | null
          id: string
          items: Json
          original_amount: number
          payment_method: string
          payment_status: string
          phone_number: string | null
          status: string
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_address: string
          delivery_date?: string | null
          delivery_time_slot?: string | null
          discount_applied?: number | null
          discount_percentage?: number | null
          id?: string
          items: Json
          original_amount: number
          payment_method: string
          payment_status?: string
          phone_number?: string | null
          status?: string
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_address?: string
          delivery_date?: string | null
          delivery_time_slot?: string | null
          discount_applied?: number | null
          discount_percentage?: number | null
          id?: string
          items?: Json
          original_amount?: number
          payment_method?: string
          payment_status?: string
          phone_number?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_discounts: {
        Row: {
          created_at: string | null
          discount_percentage: number
          discount_type: string
          id: string
          is_active: boolean | null
          orders_remaining: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number
          discount_type?: string
          id?: string
          is_active?: boolean | null
          orders_remaining?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          discount_type?: string
          id?: string
          is_active?: boolean | null
          orders_remaining?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_discounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          discount_orders_remaining: number | null
          email: string
          first_order_discount_used: boolean | null
          full_name: string | null
          id: string
          phone: string | null
          profile_image_url: string | null
          total_orders: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_orders_remaining?: number | null
          email: string
          first_order_discount_used?: boolean | null
          full_name?: string | null
          id: string
          phone?: string | null
          profile_image_url?: string | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_orders_remaining?: number | null
          email?: string
          first_order_discount_used?: boolean | null
          full_name?: string | null
          id?: string
          phone?: string | null
          profile_image_url?: string | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_user_discount: {
        Args: { p_user_id: string; p_order_total: number }
        Returns: {
          discount_amount: number
          discount_percentage: number
          final_total: number
        }[]
      }
      check_first_time_discount: {
        Args: { p_user_id: string }
        Returns: {
          qualifies: boolean
          discount_percentage: number
          orders_remaining: number
        }[]
      }
      generate_join_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_group_summary: {
        Args: { group_id: string }
        Returns: {
          member_count: number
          total_amount: number
          discount_amount: number
          final_amount: number
          qualifies_for_discount: boolean
        }[]
      }
      sanitize_text_input: {
        Args: { input_text: string; max_length?: number }
        Returns: string
      }
      validate_email_format: {
        Args: { email: string }
        Returns: boolean
      }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
      validate_phone_number: {
        Args: { phone: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
