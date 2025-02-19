import { StateCreator } from "zustand";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  attachments?: string[];
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
  description?: string;
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
  createChat: (chat: Omit<Chat, "id" | "createdAt" | "updatedAt">) => string;
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
    const currentUser = useDashboardStore.getState().currentUser;
    if (!currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      replyTo,
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
      chats: state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp,
            }
          : chat,
      ),
    }));
  },

  createChat: (chatData) => {
    const newChat: Chat = {
      ...chatData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };

    set((state) => ({
      chats: [...state.chats, newChat],
      messages: { ...state.messages, [newChat.id]: [] },
    }));

    return newChat.id;
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
