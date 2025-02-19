-- Create tables function
CREATE OR REPLACE FUNCTION create_tables()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Enable necessary extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Create custom types if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'System Administrator',
            'Director',
            'House Master',
            'Deputy House Master',
            'Support Staff',
            'Prefect',
            'Medical Staff',
            'Kitchen Staff',
            'Boarder Parent',
            'Boarder'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('Active', 'Inactive', 'Pending');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'house_status') THEN
        CREATE TYPE house_status AS ENUM ('Active', 'Maintenance', 'Inactive');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status') THEN
        CREATE TYPE room_status AS ENUM ('Available', 'Occupied', 'Maintenance');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bed_status') THEN
        CREATE TYPE bed_status AS ENUM ('Available', 'Occupied', 'Maintenance');
    END IF;

    -- Create profiles table
    CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        auth_id TEXT UNIQUE REFERENCES auth.users,
        full_name TEXT NOT NULL,
        role user_role NOT NULL,
        status user_status NOT NULL DEFAULT 'Active',
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        address TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create houses table
    CREATE TABLE IF NOT EXISTS houses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        house_master_id UUID REFERENCES profiles(id),
        deputy_master_id UUID REFERENCES profiles(id),
        status house_status NOT NULL DEFAULT 'Active',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create rooms table
    CREATE TABLE IF NOT EXISTS rooms (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        house_id UUID NOT NULL REFERENCES houses(id),
        room_number TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        status room_status NOT NULL DEFAULT 'Available',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(house_id, room_number)
    );

    -- Create beds table
    CREATE TABLE IF NOT EXISTS beds (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        room_id UUID NOT NULL REFERENCES rooms(id),
        bed_number TEXT NOT NULL,
        status bed_status NOT NULL DEFAULT 'Available',
        current_boarder_id UUID REFERENCES profiles(id),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(room_id, bed_number)
    );

    -- Create chats table
    CREATE TABLE IF NOT EXISTS chats (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
        name TEXT NOT NULL,
        created_by UUID NOT NULL REFERENCES profiles(id),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create chat_participants table
    CREATE TABLE IF NOT EXISTS chat_participants (
        chat_id UUID NOT NULL REFERENCES chats(id),
        user_id UUID NOT NULL REFERENCES profiles(id),
        unread_count INTEGER NOT NULL DEFAULT 0,
        joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (chat_id, user_id)
    );

    -- Create messages table
    CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        chat_id UUID NOT NULL REFERENCES chats(id),
        sender_id UUID NOT NULL REFERENCES profiles(id),
        content TEXT NOT NULL,
        reply_to UUID REFERENCES messages(id),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create trigger function for updated_at
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create triggers for updated_at
    DROP TRIGGER IF EXISTS set_timestamp ON profiles;
    CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();

    DROP TRIGGER IF EXISTS set_timestamp ON houses;
    CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON houses
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();

    DROP TRIGGER IF EXISTS set_timestamp ON rooms;
    CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON rooms
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();

    DROP TRIGGER IF EXISTS set_timestamp ON beds;
    CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON beds
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();

    DROP TRIGGER IF EXISTS set_timestamp ON chats;
    CREATE TRIGGER set_timestamp
        BEFORE UPDATE ON chats
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp();
END;
$$;