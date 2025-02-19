-- Seed medical records
INSERT INTO medical_records (boarder_id, allergies, chronic_conditions, emergency_contact) VALUES
('u17', ARRAY['Peanuts', 'Penicillin'], ARRAY['Asthma'], 'Mr. Smith (Father) - +1234567890'),
('u18', ARRAY['Dairy'], ARRAY['None'], 'Mr. Smith (Father) - +1234567890'),
('u19', ARRAY['None'], ARRAY['Diabetes'], 'Mrs. Jones (Mother) - +0987654321'),
('u20', ARRAY['Shellfish'], ARRAY['None'], 'Mrs. Jones (Mother) - +0987654321')
ON CONFLICT DO NOTHING;

-- Seed clinic visits
INSERT INTO clinic_visits (boarder_id, visit_date, reason, vitals, treatment, staff_id) VALUES
('u17', NOW() - INTERVAL '2 days', 'Asthma flare-up', 
  '{"temperature": 37.2, "blood_pressure": "120/80", "pulse": 82}',
  'Administered inhaler', 'u7'),
('u18', NOW() - INTERVAL '1 day', 'Headache', 
  '{"temperature": 37.8, "blood_pressure": "118/76", "pulse": 78}',
  'Given paracetamol', 'u7'),
('u19', NOW() - INTERVAL '3 days', 'Routine diabetes check', 
  '{"temperature": 36.9, "blood_pressure": "122/82", "pulse": 76}',
  'Blood sugar levels normal', 'u8')
ON CONFLICT DO NOTHING;

-- Seed medication schedules
INSERT INTO medication_schedules (boarder_id, medicine_name, dosage, frequency, start_date) VALUES
('u17', 'Ventolin Inhaler', '2 puffs', 'As needed', CURRENT_DATE),
('u19', 'Metformin', '500mg', 'Twice daily', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Seed medication logs
INSERT INTO medication_logs (schedule_id, administered_at, administered_by, status) 
SELECT 
  ms.id,
  NOW(),
  'u7',
  'taken'
FROM medication_schedules ms
WHERE ms.boarder_id IN ('u17', 'u19')
ON CONFLICT DO NOTHING;

-- Seed immunizations
INSERT INTO immunizations (boarder_id, vaccine_name, administered_date, administered_by) VALUES
('u17', 'COVID-19 Vaccine', CURRENT_DATE - INTERVAL '30 days', 'u8'),
('u18', 'COVID-19 Vaccine', CURRENT_DATE - INTERVAL '30 days', 'u8'),
('u19', 'COVID-19 Vaccine', CURRENT_DATE - INTERVAL '30 days', 'u8'),
('u20', 'COVID-19 Vaccine', CURRENT_DATE - INTERVAL '30 days', 'u8')
ON CONFLICT DO NOTHING;

-- Seed wellbeing surveys
INSERT INTO wellbeing_surveys (boarder_id, responses, risk_score) VALUES
('u17', '{"mood": 4, "sleep": 7, "stress": false, "loneliness": 2}', 2),
('u18', '{"mood": 3, "sleep": 6, "stress": true, "loneliness": 3}', 4),
('u19', '{"mood": 5, "sleep": 8, "stress": false, "loneliness": 1}', 1),
('u20', '{"mood": 4, "sleep": 7, "stress": false, "loneliness": 2}', 2)
ON CONFLICT DO NOTHING;