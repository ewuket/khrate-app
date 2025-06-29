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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bundle_items: {
        Row: {
          bundle_id: number | null
          created_at: string | null
          id: number
          item_name: string
          quantity: number
          unit: string | null
        }
        Insert: {
          bundle_id?: number | null
          created_at?: string | null
          id?: number
          item_name: string
          quantity?: number
          unit?: string | null
        }
        Update: {
          bundle_id?: number | null
          created_at?: string | null
          id?: number
          item_name?: string
          quantity?: number
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
        ]
      }
      bundles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          original_price: number | null
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          original_price?: number | null
          price: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          original_price?: number | null
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
      custom_buy_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          stock_quantity: number | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          stock_quantity?: number | null
          unit?: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number | null
          unit?: string
          updated_at?: string | null
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
            foreignKeyName: "fk_group_cart_items_group_session"
            columns: ["group_session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_cart_items_group_session_id_fkey"
            columns: ["group_session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_member_payments: {
        Row: {
          amount: number
          created_at: string | null
          group_session_id: string | null
          id: string
          payment_method: string | null
          payment_status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          group_session_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          group_session_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_member_payments_group_session_id_fkey"
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
            foreignKeyName: "fk_group_members_group_session"
            columns: ["group_session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
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
          admin_notes: string | null
          created_at: string
          discount_percentage: number
          featured_at: string | null
          group_type: string
          id: string
          is_featured: boolean | null
          is_public: boolean
          items: Json | null
          join_code: string
          leader_id: string
          location: string | null
          max_participants: number
          min_participants: number
          name: string | null
          order_status: string | null
          region: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          discount_percentage?: number
          featured_at?: string | null
          group_type?: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean
          items?: Json | null
          join_code: string
          leader_id: string
          location?: string | null
          max_participants?: number
          min_participants?: number
          name?: string | null
          order_status?: string | null
          region?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          discount_percentage?: number
          featured_at?: string | null
          group_type?: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean
          items?: Json | null
          join_code?: string
          leader_id?: string
          location?: string | null
          max_participants?: number
          min_participants?: number
          name?: string | null
          order_status?: string | null
          region?: string | null
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
      can_access_group: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
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
      get_admin_group_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_groups: number
          active_groups: number
          featured_groups: number
          completed_groups: number
          total_members: number
          avg_group_size: number
        }[]
      }
      get_custom_items_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_featured_groups: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          location: string
          region: string
          member_count: number
          max_participants: number
          discount_percentage: number
          status: string
          join_code: string
          created_at: string
          items: Json
        }[]
      }
      get_group_payment_summary: {
        Args: { group_id: string }
        Returns: {
          total_members: number
          paid_members: number
          pending_members: number
          total_amount_paid: number
          group_ready: boolean
        }[]
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
      get_groups_by_location: {
        Args: { p_location?: string; p_region?: string }
        Returns: {
          id: string
          name: string
          location: string
          region: string
          member_count: number
          max_participants: number
          discount_percentage: number
          status: string
          join_code: string
          created_at: string
        }[]
      }
      is_group_member: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
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
