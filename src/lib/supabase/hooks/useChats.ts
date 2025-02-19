import { useEffect, useState } from "react";
import { supabase } from "../client";
import { Chat } from "@/types";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("chats").select(`
          id,
          type,
          name,
          created_at,
          updated_at,
          allowed_roles,
          participants:chat_participants(user_id, unread_count)
        `);

      if (error) throw error;
      setChats(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }

  async function createChat(chatData: Partial<Chat>) {
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert(chatData)
        .select()
        .single();

      if (error) throw error;
      setChats((current) => [...current, data]);
      return data;
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  }

  return {
    chats,
    loading,
    error,
    createChat,
  };
}
