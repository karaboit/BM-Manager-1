export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      announcement_acknowledgments: {
        Row: {
          announcement_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          announcement_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          announcement_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcement_acknowledgments_announcement_id_fkey";
            columns: ["announcement_id"];
            isOneToOne: false;
            referencedRelation: "announcements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcement_acknowledgments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      announcements: {
        Row: {
          content: string;
          created_at: string;
          created_by: string;
          end_date: string | null;
          id: string;
          priority: string;
          start_date: string;
          target_roles: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          created_by: string;
          end_date?: string | null;
          id?: string;
          priority: string;
          start_date?: string;
          target_roles: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          created_by?: string;
          end_date?: string | null;
          id?: string;
          priority?: string;
          start_date?: string;
          target_roles?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance_records: {
        Row: {
          boarder_id: string | null;
          created_at: string;
          date: string;
          id: string;
          marked_by: string | null;
          reason: string | null;
          roll_call_type: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          boarder_id?: string | null;
          created_at?: string;
          date: string;
          id?: string;
          marked_by?: string | null;
          reason?: string | null;
          roll_call_type: string;
          status: string;
          updated_at?: string;
        };
        Update: {
          boarder_id?: string | null;
          created_at?: string;
          date?: string;
          id?: string;
          marked_by?: string | null;
          reason?: string | null;
          roll_call_type?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_records_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_records_marked_by_fkey";
            columns: ["marked_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      auth_users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          password_hash: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          password_hash: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          password_hash?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      beds: {
        Row: {
          boarder_id: string | null;
          created_at: string;
          id: string;
          room_id: string | null;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          boarder_id?: string | null;
          created_at?: string;
          id?: string;
          room_id?: string | null;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          boarder_id?: string | null;
          created_at?: string;
          id?: string;
          room_id?: string | null;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "beds_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "beds_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_participants: {
        Row: {
          chat_id: string;
          joined_at: string;
          unread_count: number;
          user_id: string;
        };
        Insert: {
          chat_id: string;
          joined_at?: string;
          unread_count?: number;
          user_id: string;
        };
        Update: {
          chat_id?: string;
          joined_at?: string;
          unread_count?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
        ];
      };
      chats: {
        Row: {
          allowed_roles: string[] | null;
          avatar: string | null;
          created_at: string;
          description: string | null;
          id: string;
          last_message: Json | null;
          name: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          allowed_roles?: string[] | null;
          avatar?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          last_message?: Json | null;
          name: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          allowed_roles?: string[] | null;
          avatar?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          last_message?: Json | null;
          name?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clinic_visits: {
        Row: {
          boarder_id: string | null;
          created_at: string;
          diagnosis: string | null;
          follow_up_date: string | null;
          id: string;
          reason: string;
          staff_id: string | null;
          treatment: string | null;
          updated_at: string;
          visit_date: string;
          vitals: Json;
        };
        Insert: {
          boarder_id?: string | null;
          created_at?: string;
          diagnosis?: string | null;
          follow_up_date?: string | null;
          id?: string;
          reason: string;
          staff_id?: string | null;
          treatment?: string | null;
          updated_at?: string;
          visit_date?: string;
          vitals?: Json;
        };
        Update: {
          boarder_id?: string | null;
          created_at?: string;
          diagnosis?: string | null;
          follow_up_date?: string | null;
          id?: string;
          reason?: string;
          staff_id?: string | null;
          treatment?: string | null;
          updated_at?: string;
          visit_date?: string;
          vitals?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "clinic_visits_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clinic_visits_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      dietary_requirements: {
        Row: {
          boarder_id: string;
          created_at: string;
          details: string | null;
          id: string;
          medical_note: string | null;
          requirement_type: string;
          updated_at: string;
        };
        Insert: {
          boarder_id: string;
          created_at?: string;
          details?: string | null;
          id?: string;
          medical_note?: string | null;
          requirement_type: string;
          updated_at?: string;
        };
        Update: {
          boarder_id?: string;
          created_at?: string;
          details?: string | null;
          id?: string;
          medical_note?: string | null;
          requirement_type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dietary_requirements_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      discipline_records: {
        Row: {
          approved_by: string | null;
          boarder_id: string | null;
          category: string;
          completed_at: string | null;
          created_at: string;
          date: string;
          id: string;
          offense: string;
          punishment: string | null;
          reported_by: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          approved_by?: string | null;
          boarder_id?: string | null;
          category: string;
          completed_at?: string | null;
          created_at?: string;
          date: string;
          id?: string;
          offense: string;
          punishment?: string | null;
          reported_by?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          approved_by?: string | null;
          boarder_id?: string | null;
          category?: string;
          completed_at?: string | null;
          created_at?: string;
          date?: string;
          id?: string;
          offense?: string;
          punishment?: string | null;
          reported_by?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "discipline_records_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "discipline_records_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "discipline_records_reported_by_fkey";
            columns: ["reported_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      houses: {
        Row: {
          capacity: number;
          created_at: string;
          id: string;
          name: string;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          capacity?: number;
          created_at?: string;
          id?: string;
          name: string;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          capacity?: number;
          created_at?: string;
          id?: string;
          name?: string;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      immunizations: {
        Row: {
          administered_by: string;
          administered_date: string;
          boarder_id: string;
          created_at: string;
          dose_number: number;
          id: string;
          next_dose_date: string | null;
          notes: string | null;
          updated_at: string;
          vaccine_name: string;
        };
        Insert: {
          administered_by: string;
          administered_date: string;
          boarder_id: string;
          created_at?: string;
          dose_number?: number;
          id?: string;
          next_dose_date?: string | null;
          notes?: string | null;
          updated_at?: string;
          vaccine_name: string;
        };
        Update: {
          administered_by?: string;
          administered_date?: string;
          boarder_id?: string;
          created_at?: string;
          dose_number?: number;
          id?: string;
          next_dose_date?: string | null;
          notes?: string | null;
          updated_at?: string;
          vaccine_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "immunizations_administered_by_fkey";
            columns: ["administered_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "immunizations_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      leave_requests: {
        Row: {
          boarder_id: string | null;
          created_at: string;
          end_date: string;
          house_master_approval_date: string | null;
          id: string;
          parent_approval_date: string | null;
          reason: string;
          start_date: string;
          status: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          boarder_id?: string | null;
          created_at?: string;
          end_date: string;
          house_master_approval_date?: string | null;
          id?: string;
          parent_approval_date?: string | null;
          reason: string;
          start_date: string;
          status?: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          boarder_id?: string | null;
          created_at?: string;
          end_date?: string;
          house_master_approval_date?: string | null;
          id?: string;
          parent_approval_date?: string | null;
          reason?: string;
          start_date?: string;
          status?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leave_requests_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      meal_plans: {
        Row: {
          created_at: string;
          created_by: string;
          date: string;
          dietary_requirements: Json | null;
          expected_count: number;
          id: string;
          meal_type: string;
          menu: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          date: string;
          dietary_requirements?: Json | null;
          expected_count: number;
          id?: string;
          meal_type: string;
          menu: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          date?: string;
          dietary_requirements?: Json | null;
          expected_count?: number;
          id?: string;
          meal_type?: string;
          menu?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meal_plans_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      medical_records: {
        Row: {
          allergies: string[] | null;
          blood_type: string | null;
          boarder_id: string | null;
          chronic_conditions: string[] | null;
          created_at: string;
          emergency_contact: string;
          id: string;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          allergies?: string[] | null;
          blood_type?: string | null;
          boarder_id?: string | null;
          chronic_conditions?: string[] | null;
          created_at?: string;
          emergency_contact: string;
          id?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          allergies?: string[] | null;
          blood_type?: string | null;
          boarder_id?: string | null;
          chronic_conditions?: string[] | null;
          created_at?: string;
          emergency_contact?: string;
          id?: string;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medical_records_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      medication_logs: {
        Row: {
          administered_at: string;
          administered_by: string;
          created_at: string;
          id: string;
          notes: string | null;
          schedule_id: string;
          status: string;
        };
        Insert: {
          administered_at?: string;
          administered_by: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          schedule_id: string;
          status: string;
        };
        Update: {
          administered_at?: string;
          administered_by?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          schedule_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medication_logs_administered_by_fkey";
            columns: ["administered_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "medication_logs_schedule_id_fkey";
            columns: ["schedule_id"];
            isOneToOne: false;
            referencedRelation: "medication_schedules";
            referencedColumns: ["id"];
          },
        ];
      };
      medication_schedules: {
        Row: {
          boarder_id: string;
          created_at: string;
          dosage: string;
          end_date: string | null;
          frequency: string;
          id: string;
          medicine_name: string;
          notes: string | null;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          boarder_id: string;
          created_at?: string;
          dosage: string;
          end_date?: string | null;
          frequency: string;
          id?: string;
          medicine_name: string;
          notes?: string | null;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          boarder_id?: string;
          created_at?: string;
          dosage?: string;
          end_date?: string | null;
          frequency?: string;
          id?: string;
          medicine_name?: string;
          notes?: string | null;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medication_schedules_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_templates: {
        Row: {
          created_at: string;
          created_by: string;
          dietary_notes: string | null;
          id: string;
          items: string;
          name: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          dietary_notes?: string | null;
          id?: string;
          items: string;
          name: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          dietary_notes?: string | null;
          id?: string;
          items?: string;
          name?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "menu_templates_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          attachments: string[] | null;
          chat_id: string | null;
          content: string;
          id: string;
          reply_to: string | null;
          sender_id: string | null;
          timestamp: string;
        };
        Insert: {
          attachments?: string[] | null;
          chat_id?: string | null;
          content: string;
          id?: string;
          reply_to?: string | null;
          sender_id?: string | null;
          timestamp?: string;
        };
        Update: {
          attachments?: string[] | null;
          chat_id?: string | null;
          content?: string;
          id?: string;
          reply_to?: string | null;
          sender_id?: string | null;
          timestamp?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_reply_to_fkey";
            columns: ["reply_to"];
            isOneToOne: false;
            referencedRelation: "messages";
            referencedColumns: ["id"];
          },
        ];
      };
      packed_meals: {
        Row: {
          boarder_id: string;
          created_at: string;
          id: string;
          meal_plan_id: string;
          reason: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          boarder_id: string;
          created_at?: string;
          id?: string;
          meal_plan_id: string;
          reason: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          boarder_id?: string;
          created_at?: string;
          id?: string;
          meal_plan_id?: string;
          reason?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "packed_meals_boarder_id_fkey";
            columns: ["boarder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "packed_meals_meal_plan_id_fkey";
            columns: ["meal_plan_id"];
            isOneToOne: false;
            referencedRelation: "meal_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      role_mappings: {
        Row: {
          created_at: string;
          new_role_id: string;
          old_role_id: string;
        };
        Insert: {
          created_at?: string;
          new_role_id: string;
          old_role_id: string;
        };
        Update: {
          created_at?: string;
          new_role_id?: string;
          old_role_id?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          role_key: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          role_key: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          role_key?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      roles_backup: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string | null;
          name: string | null;
          role_key: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string | null;
          name?: string | null;
          role_key?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string | null;
          name?: string | null;
          role_key?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      roles_new: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          permissions: Json | null;
          role_key: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          permissions?: Json | null;
          role_key: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          permissions?: Json | null;
          role_key?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          capacity: number;
          created_at: string;
          house_id: string | null;
          id: string;
          last_cleaned: string | null;
          room_number: string;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          capacity?: number;
          created_at?: string;
          house_id?: string | null;
          id?: string;
          last_cleaned?: string | null;
          room_number: string;
          status?: string | null;
          updated_at?: string;
        };
        Update: {
          capacity?: number;
          created_at?: string;
          house_id?: string | null;
          id?: string;
          last_cleaned?: string | null;
          room_number?: string;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_house_id_fkey";
            columns: ["house_id"];
            isOneToOne: false;
            referencedRelation: "houses";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          role_id: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          role_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          role_id?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role:
        | "system_admin"
        | "director"
        | "house_master"
        | "deputy_master"
        | "medical"
        | "kitchen"
        | "parent"
        | "boarder"
        | "support_staff";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
