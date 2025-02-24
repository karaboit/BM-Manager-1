import { supabase } from "../supabase/client";
import { Chat, Message } from "../types/chat";

export async function getChats(userId: string) {
  const { data, error } = await supabase
    .from("chats")
    .select(
      `
      *,
      chat_participants!inner(user_id, unread_count),
      last_message:messages(content, timestamp, sender:users(*))
    `,
    )
    .eq("chat_participants.user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMessages(chatId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:users(*),
      reply_to:messages(*)
    `,
    )
    .eq("chat_id", chatId)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendMessage(message: Omit<Message, "id" | "timestamp">) {
  const { data, error } = await supabase
    .from("messages")
    .insert(message)
    .select()
    .single();

  if (error) throw error;

  // Update chat's last_message and updated_at
  await supabase
    .from("chats")
    .update({
      last_message: data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", message.chat_id);

  return data;
}

export async function createChat(
  chat: Omit<Chat, "id" | "created_at" | "updated_at">,
) {
  const { data: newChat, error: chatError } = await supabase
    .from("chats")
    .insert({
      type: chat.type,
      name: chat.name,
      avatar: chat.avatar,
      description: chat.description,
      allowed_roles: chat.allowed_roles,
    })
    .select()
    .single();

  if (chatError) throw chatError;

  // Add participants
  const participantRows = chat.participants.map((userId) => ({
    chat_id: newChat.id,
    user_id: userId,
    unread_count: 0,
  }));

  const { error: participantError } = await supabase
    .from("chat_participants")
    .insert(participantRows);

  if (participantError) throw participantError;

  return newChat;
}

export async function markAsRead(chatId: string, userId: string) {
  const { error } = await supabase
    .from("chat_participants")
    .update({ unread_count: 0 })
    .eq("chat_id", chatId)
    .eq("user_id", userId);

  if (error) throw error;
}
