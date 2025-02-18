export interface MealPlan {
  meal_id: string;
  meal_date: string;
  meal_time: "Breakfast" | "Lunch" | "Dinner";
  title: string;
  description: string;
  expected_count: number;
  created_at: string;
  updated_at: string;
}

export interface MealPreference {
  preference_id: string;
  boarder_id: string;
  diet_type: string[];
  allergies: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MealAttendance {
  attendance_id: string;
  meal_id: string;
  boarder_id: string;
  status: "attended" | "absent" | "excused";
  created_at: string;
}

export interface MenuTemplate {
  template_id: string;
  name: string;
  meal_time: "Breakfast" | "Lunch" | "Dinner";
  items: string[];
  dietary_notes?: string;
  created_at: string;
  updated_at: string;
}
