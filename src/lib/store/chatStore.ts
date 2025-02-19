import { create } from "zustand";
import { supabase } from "../supabase/client";
import { useDashboardStore } from "@/lib/store";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  replyTo?: string;
}

interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  allowedRoles?: string[];
}

interface ChatStore {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChat: string | null;
  isLoading: boolean;
  error: string | null;
  setSelectedChat: (chatId: string | null) => void;
  sendMessage: (
    chatId: string,
    content: string,
    replyTo?: string,
  ) => Promise<void>;
  createChat: (
    chatData: Omit<Chat, "id" | "createdAt" | "updatedAt">,
  ) => Promise<string>;
  markAsRead: (chatId: string) => Promise<void>;
  deleteMessage: (chatId: string, messageId: string) => Promise<void>;
  editMessage: (
    chatId: string,
    messageId: string,
    content: string,
  ) => Promise<void>;
  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  selectedChat: null,
  isLoading: false,
  error: null,

  setSelectedChat: (chatId) => set({ selectedChat: chatId }),

  fetchChats: async () => {
    try {
      set({ isLoading: true });
      const { data: chats, error } = await supabase
        .from("chats")
        .select("*, chat_participants(user_id, unread_count)");

      if (error) throw error;
      set({ chats: chats || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (chatId) => {
    try {
      set({ isLoading: true });
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      set((state) => ({
        messages: { ...state.messages, [chatId]: messages || [] },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (chatId, content, replyTo) => {
    const currentUser = useDashboardStore.getState().currentUser;
    if (!currentUser) return;

    try {
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          sender_id: currentUser.id,
          content,
          reply_to: replyTo,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message],
        },
      }));

      // Update chat's last message
      await supabase
        .from("chats")
        .update({
          last_message: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chatId);
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  createChat: async (chatData) => {
    const currentUser = useDashboardStore.getState().currentUser;
    if (!currentUser) return "";

    try {
      const { data: chat, error } = await supabase
        .from("chats")
        .insert({
          ...chatData,
          created_by: currentUser.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add participants
      if (chatData.participants?.length) {
        const participantRows = chatData.participants.map((userId) => ({
          chat_id: chat.id,
          user_id: userId,
        }));

        await supabase.from("chat_participants").insert(participantRows);
      }

      set((state) => ({
        chats: [...state.chats, chat],
        messages: { ...state.messages, [chat.id]: [] },
      }));

      return chat.id;
    } catch (error) {
      set({ error: (error as Error).message });
      return "";
    }
  },

  markAsRead: async (chatId) => {
    const currentUser = useDashboardStore.getState().currentUser;
    if (!currentUser) return;

    try {
      await supabase
        .from("chat_participants")
        .update({ unread_count: 0 })
        .eq("chat_id", chatId)
        .eq("user_id", currentUser.id);

      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  deleteMessage: async (chatId, messageId) => {
    const currentUser = useDashboardStore.getState().currentUser;
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId)
        .eq("sender_id", currentUser.id);

      if (error) throw error;

      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].filter(
            (msg) => msg.id !== messageId,
          ),
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  editMessage: async (chatId, messageId, content) => {
    const currentUser = useDashboardStore.getState().currentUser;
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({ content })
        .eq("id", messageId)
        .eq("sender_id", currentUser.id);

      if (error) throw error;

      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg,
          ),
        },
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
