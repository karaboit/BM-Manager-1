export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  reply_to?: string;
}

export interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  participants: string[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
  avatar?: string;
  description?: string;
  allowed_roles?: string[];
}

export interface ChatParticipant {
  chat_id: string;
  user_id: string;
  unread_count: number;
  joined_at: string;
}
