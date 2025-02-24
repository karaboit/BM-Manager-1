import { StateCreator } from "zustand";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  replyTo?: string;
}

export interface Chat {
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

export interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChat: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatActions {
  setSelectedChat: (chatId: string | null) => void;
  sendMessage: (chatId: string, content: string, replyTo?: string) => void;
  createChat: (
    chatData: Omit<Chat, "id" | "createdAt" | "updatedAt">,
  ) => string;
  markAsRead: (chatId: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  editMessage: (chatId: string, messageId: string, content: string) => void;
}

export type ChatSlice = ChatState & ChatActions;

export const createChatSlice: StateCreator<ChatSlice> = (set, get) => ({
  chats: [],
  messages: {},
  selectedChat: null,
  isLoading: false,
  error: null,

  setSelectedChat: (chatId) => set({ selectedChat: chatId }),

  sendMessage: (chatId, content, replyTo) => {
    const message = {
      id: crypto.randomUUID(),
      chatId,
      senderId: get().currentUser?.id || "",
      content,
      timestamp: new Date().toISOString(),
      replyTo,
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), message],
      },
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: message,
              updatedAt: message.timestamp,
            }
          : chat,
      ),
    }));
  },

  createChat: (chatData) => {
    const chatId = crypto.randomUUID();
    const chat: Chat = {
      id: chatId,
      type: chatData.type,
      name: chatData.name,
      participants: chatData.participants,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: chatData.avatar,
      allowedRoles: chatData.allowedRoles,
    };

    set((state) => ({
      chats: [...state.chats, chat],
      messages: { ...state.messages, [chatId]: [] },
    }));

    return chatId;
  },

  markAsRead: (chatId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
      ),
    }));
  },

  deleteMessage: (chatId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].filter((msg) => msg.id !== messageId),
      },
    }));
  },

  editMessage: (chatId, messageId, content) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((msg) =>
          msg.id === messageId ? { ...msg, content } : msg,
        ),
      },
    }));
  },
});
