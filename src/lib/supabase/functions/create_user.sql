CREATE OR REPLACE FUNCTION create_user(
    p_email TEXT,
    p_full_name TEXT,
    p_role TEXT,
    p_house_id UUID DEFAULT NULL
) RETURNS profiles AS $$
DECLARE
    v_user profiles;
BEGIN
    -- Check if email exists
    IF EXISTS (SELECT 1 FROM profiles WHERE email = p_email) THEN
        RAISE EXCEPTION 'User with email % already exists', p_email
            USING ERRCODE = '23505'; -- unique_violation
    END IF;

    -- Insert new user
    INSERT INTO profiles (
        email,
        full_name,
        role,
        house_id
    ) VALUES (
        p_email,
        p_full_name,
        p_role,
        p_house_id
    )
    RETURNING * INTO v_user;

    RETURN v_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;