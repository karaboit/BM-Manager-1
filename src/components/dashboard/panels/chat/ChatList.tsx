import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chat } from "@/lib/store/slices/chatSlice";
import { format } from "date-fns";

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
}: ChatListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-14rem)]">
      <div className="space-y-2 p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${selectedChatId === chat.id ? "bg-accent" : ""}`}
            onClick={() => onChatSelect(chat.id)}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={chat.avatar} />
                <AvatarFallback>{chat.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium truncate">{chat.name}</p>
                  {chat.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(chat.lastMessage.timestamp), "p")}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage.content}
                  </p>
                )}
              </div>
              {chat.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
