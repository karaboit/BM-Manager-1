-- Drop existing objects in the correct order to avoid dependency issues
DO $$ 
BEGIN
    -- Drop tables if they exist
    DROP TABLE IF EXISTS messages CASCADE;
    DROP TABLE IF EXISTS chat_participants CASCADE;
    DROP TABLE IF EXISTS chats CASCADE;
    DROP TABLE IF EXISTS beds CASCADE;
    DROP TABLE IF EXISTS rooms CASCADE;
    DROP TABLE IF EXISTS houses CASCADE;
    DROP TABLE IF EXISTS profiles CASCADE;
    DROP TABLE IF EXISTS attendance_records CASCADE;
    DROP TABLE IF EXISTS leave_requests CASCADE;
    DROP TABLE IF EXISTS discipline_records CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS event_participants CASCADE;
    DROP TABLE IF EXISTS medical_records CASCADE;
    DROP TABLE IF EXISTS clinic_visits CASCADE;
    DROP TABLE IF EXISTS medications CASCADE;
    DROP TABLE IF EXISTS medication_logs CASCADE;
    DROP TABLE IF EXISTS immunizations CASCADE;
    DROP TABLE IF EXISTS wellbeing_surveys CASCADE;
    DROP TABLE IF EXISTS dietary_requirements CASCADE;
    DROP TABLE IF EXISTS meal_plans CASCADE;
    DROP TABLE IF EXISTS meal_attendance CASCADE;
    DROP TABLE IF EXISTS packed_meals CASCADE;

    -- Drop types if they exist
    DROP TYPE IF EXISTS user_role CASCADE;
    DROP TYPE IF EXISTS user_status CASCADE;
    DROP TYPE IF EXISTS house_status CASCADE;
    DROP TYPE IF EXISTS room_status CASCADE;
    DROP TYPE IF EXISTS bed_status CASCADE;
END $$;

-- Now run the schema files in order
\i 'schema/01_core.sql'
\i 'schema/02_boarding.sql'
\i 'schema/03_medical.sql'
\i 'schema/04_kitchen.sql'
