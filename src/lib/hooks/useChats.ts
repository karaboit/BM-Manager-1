import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { Chat } from "@/types/chat";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChats();

    // Set up real-time subscription for chat updates
    const subscription = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chats",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setChats((prev) => [...prev, payload.new as Chat]);
          } else if (payload.eventType === "UPDATE") {
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === payload.new.id ? (payload.new as Chat) : chat,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setChats((prev) =>
              prev.filter((chat) => chat.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*, chat_participants(*)")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (chatData: Partial<Chat>) => {
    try {
      const { data, error } = await supabase
        .from("chats")
        .insert(chatData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { chats, loading, error, createChat, refreshChats: fetchChats };
}
