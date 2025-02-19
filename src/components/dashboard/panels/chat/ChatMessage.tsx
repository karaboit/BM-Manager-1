import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/lib/store/slices/chatSlice";
import { useDashboardStore } from "@/lib/store";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
}

export function ChatMessage({ message, showAvatar = true }: ChatMessageProps) {
  const { currentUser } = useDashboardStore();
  const isOwnMessage = message.senderId === currentUser?.id;

  return (
    <div
      className={`flex gap-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      {!isOwnMessage && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId}`}
          />
          <AvatarFallback>{message.senderId[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[70%] rounded-lg p-3 ${isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        <div className="flex flex-col">
          <p className="break-words">{message.content}</p>
          <span className="text-xs opacity-70 mt-1 text-right">
            {format(new Date(message.timestamp), "p")}
          </span>
        </div>
      </div>
      {isOwnMessage && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId}`}
          />
          <AvatarFallback>{message.senderId[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
