import { supabase } from "./client";

// Create tables
export async function createProfilesTable() {
  const { error } = await supabase.from("profiles").select().limit(1);

  if (error?.code === "42P01") {
    // Table doesn't exist
    return await supabase.rpc("create_profiles_table");
  }
}

export async function createHousesTable() {
  const { error } = await supabase.from("houses").select().limit(1);

  if (error?.code === "42P01") {
    return await supabase.rpc("create_houses_table");
  }
}

export async function createRoomsTable() {
  const { error } = await supabase.from("rooms").select().limit(1);

  if (error?.code === "42P01") {
    return await supabase.rpc("create_rooms_table");
  }
}

export async function createBedsTable() {
  const { error } = await supabase.from("beds").select().limit(1);

  if (error?.code === "42P01") {
    return await supabase.rpc("create_beds_table");
  }
}

export async function createChatsTable() {
  const { error } = await supabase.from("chats").select().limit(1);

  if (error?.code === "42P01") {
    return await supabase.rpc("create_chats_table");
  }
}

export async function createChatParticipantsTable() {
  const { error } = await supabase.from("chat_participants").select().limit(1);

  if (error?.code === "42P01") {
    return await supabase.rpc("create_chat_participants_table");
  }
}

export async function createMessagesTable() {
  const { error } = await supabase.from("messages").select().limit(1);

  if (error?.code === "42P01") {
    return await supabase.rpc("create_messages_table");
  }
}

// Initialize database
export async function initializeDatabase() {
  try {
    await createProfilesTable();
    await createHousesTable();
    await createRoomsTable();
    await createBedsTable();
    await createChatsTable();
    await createChatParticipantsTable();
    await createMessagesTable();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
