-- Seed attendance records
INSERT INTO attendance_records (boarder_id, date, roll_call_type, status, marked_by) VALUES
('u17', CURRENT_DATE, 'Morning', 'Present', 'u3'),
('u18', CURRENT_DATE, 'Morning', 'Present', 'u3'),
('u19', CURRENT_DATE, 'Morning', 'Late', 'u4'),
('u20', CURRENT_DATE, 'Morning', 'Present', 'u4'),
('u17', CURRENT_DATE, 'Afternoon', 'Present', 'u3'),
('u18', CURRENT_DATE, 'Afternoon', 'Present', 'u3'),
('u19', CURRENT_DATE, 'Afternoon', 'Present', 'u4'),
('u20', CURRENT_DATE, 'Afternoon', 'Present', 'u4')
ON CONFLICT DO NOTHING;

-- Seed leave requests
INSERT INTO leave_requests (boarder_id, start_date, end_date, type, reason, status) VALUES
('u17', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 
  'Family', 'Family wedding', 'Pending Parent'),
('u18', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '6 days',
  'Medical', 'Dental appointment', 'Approved'),
('u19', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '8 days',
  'Academic', 'University open day', 'Pending House Master')
ON CONFLICT DO NOTHING;

-- Seed discipline records
INSERT INTO discipline_records (boarder_id, offense, category, date, punishment, status, reported_by) VALUES
('u19', 'Late return from outing', 'Minor', CURRENT_DATE - INTERVAL '2 days',
  'Extra study hour', 'Completed', 'u4'),
('u20', 'Room untidiness', 'Minor', CURRENT_DATE - INTERVAL '1 day',
  'Clean common room', 'Pending', 'u4')
ON CONFLICT DO NOTHING;

-- Seed events
INSERT INTO events (title, description, start_date, end_date, location, max_participants, created_by) VALUES
('Weekend Sports Tournament', 'Inter-house sports competition',
  CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '6 hours',
  'Sports Field', 50, 'u3'),
('Study Skills Workshop', 'Exam preparation techniques',
  CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '5 days' + INTERVAL '2 hours',
  'Library', 30, 'u4')
ON CONFLICT DO NOTHING;

-- Seed event registrations
INSERT INTO event_registrations (event_id, boarder_id, status, packed_meals)
SELECT 
  e.id,
  'u17',
  'Registered',
  ARRAY['lunch']
FROM events e
WHERE e.title = 'Weekend Sports Tournament'
ON CONFLICT DO NOTHING;

-- Seed announcements
INSERT INTO announcements (title, content, priority, target_roles, created_by) VALUES
('Maintenance Notice', 'West Wing bathroom maintenance scheduled for weekend',
  'Medium', ARRAY['Boarder', 'House Master', 'Deputy House Master'], 'u1'),
('Exam Week Schedule', 'Final exam schedule and study hall arrangements',
  'High', ARRAY['Boarder', 'House Master', 'Deputy House Master', 'Prefect'], 'u2')
ON CONFLICT DO NOTHING;