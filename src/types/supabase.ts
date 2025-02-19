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
      allergies: {
        Row: {
          allergy_type: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          severity: string | null
          student_id: string | null
          symptoms: string[] | null
          treatment: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allergy_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          severity?: string | null
          student_id?: string | null
          symptoms?: string[] | null
          treatment?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allergy_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          severity?: string | null
          student_id?: string | null
          symptoms?: string[] | null
          treatment?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allergies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "allergies_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "allergies_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      beds: {
        Row: {
          created_at: string
          id: string
          name: string
          room_id: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          room_id?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          room_id?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beds_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beds_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      clinic_visits: {
        Row: {
          created_by: string | null
          diagnosis: string | null
          follow_up_date: string | null
          follow_up_needed: boolean | null
          id: string
          notes: string | null
          student_id: string | null
          symptoms: string[] | null
          treatment: string | null
          updated_by: string | null
          visit_date: string
        }
        Insert: {
          created_by?: string | null
          diagnosis?: string | null
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          id?: string
          notes?: string | null
          student_id?: string | null
          symptoms?: string[] | null
          treatment?: string | null
          updated_by?: string | null
          visit_date?: string
        }
        Update: {
          created_by?: string | null
          diagnosis?: string | null
          follow_up_date?: string | null
          follow_up_needed?: boolean | null
          id?: string
          notes?: string | null
          student_id?: string | null
          symptoms?: string[] | null
          treatment?: string | null
          updated_by?: string | null
          visit_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_visits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_visits_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "clinic_visits_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_visits_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "clinic_visits_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinic_visits_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      health_records: {
        Row: {
          blood_type: string | null
          created_at: string
          created_by: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          height: number | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          notes: string | null
          student_id: string | null
          updated_at: string
          updated_by: string | null
          weight: number | null
        }
        Insert: {
          blood_type?: string | null
          created_at?: string
          created_by?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          height?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          notes?: string | null
          student_id?: string | null
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Update: {
          blood_type?: string | null
          created_at?: string
          created_by?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          height?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          notes?: string | null
          student_id?: string | null
          updated_at?: string
          updated_by?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "health_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "health_records_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      houses: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          parent_approved: boolean | null
          reason: string | null
          start_date: string
          status: string | null
          student_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          parent_approved?: boolean | null
          reason?: string | null
          start_date: string
          status?: string | null
          student_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          parent_approved?: boolean | null
          reason?: string | null
          start_date?: string
          status?: string | null
          student_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "leave_requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      maintenance_requests: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          priority: string | null
          room_id: string | null
          status: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          priority?: string | null
          room_id?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          priority?: string | null
          room_id?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "maintenance_requests_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_requests_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      parent_student_relationships: {
        Row: {
          created_at: string | null
          id: string
          parent_id: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          parent_id?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_student_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_student_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "parent_student_relationships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_student_relationships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["student_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          house_id: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          house_id?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          house_id?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string
          floor: number | null
          house_id: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          floor?: number | null
          house_id?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          floor?: number | null
          house_id?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house_statistics"
            referencedColumns: ["house_id"]
          },
          {
            foreignKeyName: "rooms_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rooms_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "maintenance_statistics"
            referencedColumns: ["house_id"]
          },
          {
            foreignKeyName: "rooms_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "medical_statistics"
            referencedColumns: ["house_id"]
          },
          {
            foreignKeyName: "rooms_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "student_statistics"
            referencedColumns: ["house_id"]
          },
        ]
      }
    }
    Views: {
      house_statistics: {
        Row: {
          house_id: string | null
          house_name: string | null
          occupied_beds: number | null
          pending_leave_requests: number | null
          pending_maintenance: number | null
          total_beds: number | null
          total_students: number | null
        }
        Relationships: []
      }
      maintenance_statistics: {
        Row: {
          avg_hours_to_resolve: number | null
          house_id: string | null
          house_name: string | null
          status: string | null
          total_requests: number | null
        }
        Relationships: []
      }
      medical_statistics: {
        Row: {
          follow_ups_needed: number | null
          house_id: string | null
          house_name: string | null
          month: string | null
          severe_allergies: number | null
          total_allergies: number | null
          total_visits: number | null
        }
        Relationships: []
      }
      student_statistics: {
        Row: {
          allergies: number | null
          clinic_visits: number | null
          full_name: string | null
          house_id: string | null
          house_name: string | null
          pending_leave_requests: number | null
          student_id: string | null
          total_leave_requests: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
