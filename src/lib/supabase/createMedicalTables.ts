import { supabase } from "./client";

export async function createMedicalTables() {
  try {
    const { error } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Medical Records
        CREATE TABLE IF NOT EXISTS medical_records (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          allergies TEXT[] DEFAULT '{}',
          chronic_conditions TEXT[] DEFAULT '{}',
          blood_type TEXT,
          emergency_contact TEXT NOT NULL,
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Clinic Visits
        CREATE TABLE IF NOT EXISTS clinic_visits (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          visit_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          reason TEXT NOT NULL,
          vitals JSONB NOT NULL DEFAULT '{}'::jsonb,
          diagnosis TEXT,
          treatment TEXT,
          follow_up_date TIMESTAMPTZ,
          staff_id UUID NOT NULL REFERENCES profiles(id),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Medications
        CREATE TABLE IF NOT EXISTS medication_schedules (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          medicine_name TEXT NOT NULL,
          dosage TEXT NOT NULL,
          frequency TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE,
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Medication Logs
        CREATE TABLE IF NOT EXISTS medication_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          schedule_id UUID NOT NULL REFERENCES medication_schedules(id),
          administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          administered_by UUID NOT NULL REFERENCES profiles(id),
          status TEXT NOT NULL CHECK (status IN ('taken', 'missed', 'refused')),
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Immunizations
        CREATE TABLE IF NOT EXISTS immunizations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          vaccine_name TEXT NOT NULL,
          dose_number INTEGER NOT NULL DEFAULT 1,
          administered_date DATE NOT NULL,
          administered_by UUID NOT NULL REFERENCES profiles(id),
          next_dose_date DATE,
          notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        -- Wellbeing Surveys
        CREATE TABLE IF NOT EXISTS wellbeing_surveys (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          boarder_id UUID NOT NULL REFERENCES profiles(id),
          responses JSONB NOT NULL,
          risk_score INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `,
    });

    if (error) {
      console.error("Error creating medical tables:", error);
      return false;
    }

    console.log("Medical tables created successfully");
    return true;
  } catch (error) {
    console.error("Error creating medical tables:", error);
    return false;
  }
}
