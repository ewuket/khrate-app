export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
          bundle_items: Json | null
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
          bundle_items?: Json | null
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
          bundle_items?: Json | null
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_admin_role: { Args: { target_user_id: string }; Returns: undefined }
      add_admin_user: { Args: { admin_email: string }; Returns: undefined }
      apply_user_discount: {
        Args: { p_order_total: number; p_user_id: string }
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
          discount_percentage: number
          orders_remaining: number
          qualifies: boolean
        }[]
      }
      create_admin_notification: {
        Args: { p_message: string; p_title: string; p_type?: string }
        Returns: string
      }
      generate_join_code: { Args: never; Returns: string }
      get_admin_dashboard_stats: {
        Args: never
        Returns: {
          active_bundles: number
          active_custom_items: number
          active_groups: number
          pending_orders: number
          total_orders: number
          total_revenue: number
          total_users: number
        }[]
      }
      get_admin_group_stats: {
        Args: never
        Returns: {
          active_groups: number
          avg_group_size: number
          completed_groups: number
          featured_groups: number
          total_groups: number
          total_members: number
        }[]
      }
      get_admin_order_stats: {
        Args: never
        Returns: {
          pending_orders: number
          total_orders: number
          total_revenue: number
        }[]
      }
      get_admin_order_stats_by_source: {
        Args: never
        Returns: {
          bundle_orders: number
          bundle_revenue: number
          custom_orders: number
          custom_revenue: number
          group_orders: number
          group_revenue: number
        }[]
      }
      get_current_user_id: { Args: never; Returns: string }
      get_custom_items_count: { Args: never; Returns: number }
      get_daily_order_stats: {
        Args: never
        Returns: {
          bundle_orders: number
          custom_orders: number
          date_created: string
          group_orders: number
          total_orders: number
          total_revenue: number
        }[]
      }
      get_featured_groups: {
        Args: never
        Returns: {
          created_at: string
          discount_percentage: number
          id: string
          items: Json
          join_code: string
          location: string
          max_participants: number
          member_count: number
          name: string
          region: string
          status: string
        }[]
      }
      get_group_payment_summary: {
        Args: { group_id: string }
        Returns: {
          group_ready: boolean
          paid_members: number
          pending_members: number
          total_amount_paid: number
          total_members: number
        }[]
      }
      get_group_summary: {
        Args: { group_id: string }
        Returns: {
          discount_amount: number
          final_amount: number
          member_count: number
          qualifies_for_discount: boolean
          total_amount: number
        }[]
      }
      get_groups_by_location: {
        Args: { p_location?: string; p_region?: string }
        Returns: {
          created_at: string
          discount_percentage: number
          id: string
          join_code: string
          location: string
          max_participants: number
          member_count: number
          name: string
          region: string
          status: string
        }[]
      }
      get_low_stock_items: {
        Args: { threshold?: number }
        Returns: {
          category: string
          id: number
          name: string
          price: number
          stock_quantity: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
      is_group_member: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
      }
      sanitize_text_input: {
        Args: { input_text: string; max_length?: number }
        Returns: string
      }
      update_bundle_safe: {
        Args: { bundle_data: Json; bundle_id: number }
        Returns: {
          created_at: string
          description: string
          id: number
          image_url: string
          is_active: boolean
          is_featured: boolean
          original_price: number
          price: number
          title: string
          updated_at: string
        }[]
      }
      update_custom_item_safe: {
        Args: { item_data: Json; item_id: number }
        Returns: {
          category: string
          created_at: string
          description: string
          id: number
          image_url: string
          is_active: boolean
          name: string
          price: number
          stock_quantity: number
          unit: string
          updated_at: string
        }[]
      }
      validate_email_format: { Args: { email: string }; Returns: boolean }
      validate_password_strength: {
        Args: { password: string }
        Returns: boolean
      }
      validate_phone_number: { Args: { phone: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
