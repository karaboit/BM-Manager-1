-- Medical related tables

-- Medical records
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  allergies TEXT[] DEFAULT '{}',
  chronic_conditions TEXT[] DEFAULT '{}',
  blood_type TEXT,
  emergency_contact TEXT NOT NULL,
  insurance_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Clinic visits
CREATE TABLE IF NOT EXISTS clinic_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  visit_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT NOT NULL,
  symptoms TEXT[],
  diagnosis TEXT,
  treatment TEXT,
  follow_up_date DATE,
  staff_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medications
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  instructions TEXT,
  prescribed_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medication logs
CREATE TABLE IF NOT EXISTS medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID NOT NULL REFERENCES medications(id),
  administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  administered_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL CHECK (status IN ('Administered', 'Missed', 'Refused')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immunizations
CREATE TABLE IF NOT EXISTS immunizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  vaccine_name TEXT NOT NULL,
  date_administered DATE NOT NULL,
  administered_by TEXT NOT NULL,
  next_due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wellbeing surveys
CREATE TABLE IF NOT EXISTS wellbeing_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  survey_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
  sleep_hours INTEGER,
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  physical_activity INTEGER CHECK (physical_activity BETWEEN 1 AND 5),
  eating_habits INTEGER CHECK (eating_habits BETWEEN 1 AND 5),
  social_connection INTEGER CHECK (social_connection BETWEEN 1 AND 5),
  concerns TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON clinic_visits
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON immunizations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();