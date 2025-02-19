import { supabase } from "./client";

export async function createKitchenTables() {
  try {
    const { error } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Menu Templates
        CREATE TABLE IF NOT EXISTS menu_templates (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner')),
          items TEXT NOT NULL,
          dietary_notes TEXT,
          created_by UUID NOT NULL REFERENCES profiles(id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Meal Plans
        CREATE TABLE IF NOT EXISTS meal_plans (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          date DATE NOT NULL,
          meal_type TEXT NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner')),
          menu TEXT NOT NULL,
          expected_count INTEGER NOT NULL,
          dietary_requirements JSONB DEFAULT '{}',
          created_by UUID NOT NULL REFERENCES profiles(id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Dietary Requirements
        CREATE TABLE IF NOT EXISTS dietary_requirements (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          requirement_type TEXT NOT NULL,
          details TEXT,
          medical_note TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Packed Meals
        CREATE TABLE IF NOT EXISTS packed_meals (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          meal_plan_id UUID NOT NULL REFERENCES meal_plans(id),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          reason TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `,
    });

    if (error) {
      console.error("Error creating kitchen tables:", error);
      return false;
    }

    console.log("Kitchen tables created successfully");
    return true;
  } catch (error) {
    console.error("Error creating kitchen tables:", error);
    return false;
  }
}
