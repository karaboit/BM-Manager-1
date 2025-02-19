-- Create medical_records table
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

-- Create clinic_visits table
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

-- Create medication_schedules table
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

-- Create medication_logs table
CREATE TABLE IF NOT EXISTS medication_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID NOT NULL REFERENCES medication_schedules(id),
  administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  administered_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL CHECK (status IN ('taken', 'missed', 'refused')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create immunizations table
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

-- Create wellbeing_surveys table
CREATE TABLE IF NOT EXISTS wellbeing_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boarder_id UUID NOT NULL REFERENCES profiles(id),
  responses JSONB NOT NULL,
  risk_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellbeing_surveys ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own medical records"
ON medical_records FOR SELECT
TO PUBLIC
USING (
  auth.uid() = boarder_id OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (
      profiles.role IN ('System Administrator', 'Medical Staff')
      OR (profiles.role = 'Boarder Parent' AND EXISTS (
        SELECT 1 FROM parent_student_relationships
        WHERE parent_id = auth.uid()
        AND student_id = medical_records.boarder_id
      ))
    )
  )
);

CREATE POLICY "Medical staff can manage medical records"
ON medical_records
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Medical Staff')
  )
);

-- Similar policies for other medical tables
CREATE POLICY "Users can view their own clinic visits"
ON clinic_visits FOR SELECT
TO PUBLIC
USING (
  auth.uid() = boarder_id OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (
      profiles.role IN ('System Administrator', 'Medical Staff')
      OR (profiles.role = 'Boarder Parent' AND EXISTS (
        SELECT 1 FROM parent_student_relationships
        WHERE parent_id = auth.uid()
        AND student_id = clinic_visits.boarder_id
      ))
    )
  )
);

CREATE POLICY "Medical staff can manage clinic visits"
ON clinic_visits
FOR ALL
TO PUBLIC
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('System Administrator', 'Medical Staff')
  )
);