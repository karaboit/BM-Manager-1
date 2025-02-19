import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, Search, Users, UserPlus } from "lucide-react";
import { useDashboardStore } from "@/lib/store";
import { useChatStore } from "@/lib/store/chatStore";
import { ChatList } from "./chat/ChatList";
import { ChatMessage } from "./chat/ChatMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultGroups = [
  {
    id: "announcements",
    type: "group" as const,
    name: "General Announcements",
    participants: [],
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Announcements",
    allowedRoles: [
      "System Administrator",
      "House Master",
      "Deputy House Master",
    ],
  },
  {
    id: "medical",
    type: "group" as const,
    name: "Medical Updates",
    participants: [],
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Medical",
    allowedRoles: ["Medical Staff", "System Administrator", "House Master"],
  },
  {
    id: "kitchen",
    type: "group" as const,
    name: "Kitchen Updates",
    participants: [],
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kitchen",
    allowedRoles: ["Kitchen Staff", "System Administrator"],
  },
];

const MessagingPanel = () => {
  const { currentUser } = useDashboardStore();
  const {
    chats,
    messages,
    selectedChat,
    setSelectedChat,
    sendMessage,
    createChat,
    markAsRead,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [messageType, setMessageType] = useState<"group" | "direct">("direct");
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat);
      scrollToBottom();
    }
  }, [selectedChat, messages[selectedChat]]);

  const handleSendMessage = () => {
    if (!selectedChat || !newMessage.trim() || !currentUser) return;
    sendMessage(selectedChat, newMessage);
    setNewMessage("");
    scrollToBottom();
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const isDirectMessage = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat?.type === "direct";
  };

  const canSendToGroup = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat?.allowedRoles?.includes(currentUser?.role || "");
  };

  return (
    <div className="flex h-full bg-background">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={messageType === "direct" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMessageType("direct")}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Direct Message
                    </Button>
                    <Button
                      variant={messageType === "group" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMessageType("group")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Group
                    </Button>
                  </div>

                  {messageType === "group" ? (
                    <Select
                      onValueChange={(value) => {
                        const group = defaultGroups.find((g) => g.id === value);
                        if (group) {
                          createChat(group);
                          setSelectedChat(group.id);
                          setIsNewChatOpen(false);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultGroups
                          .filter((group) =>
                            group.allowedRoles?.includes(
                              currentUser?.role || "",
                            ),
                          )
                          .map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                      />
                      <ScrollArea className="h-[300px] border rounded-md p-2">
                        {demoUsers
                          .filter(
                            (user) =>
                              user.id !== currentUser?.id &&
                              (user.name
                                .toLowerCase()
                                .includes(userSearchTerm.toLowerCase()) ||
                                user.role
                                  .toLowerCase()
                                  .includes(userSearchTerm.toLowerCase())),
                          )
                          .map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                              onClick={() => {
                                const existingChat = chats.find(
                                  (chat) =>
                                    chat.type === "direct" &&
                                    chat.participants.includes(user.id) &&
                                    chat.participants.includes(
                                      currentUser?.id || "",
                                    ),
                                );

                                if (existingChat) {
                                  setSelectedChat(existingChat.id);
                                } else {
                                  const chatId = createChat({
                                    type: "direct",
                                    name: user.name,
                                    participants: [
                                      currentUser?.id || "",
                                      user.id,
                                    ],
                                    unreadCount: 0,
                                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
                                  });
                                  setSelectedChat(chatId);
                                }
                                setIsNewChatOpen(false);
                              }}
                            >
                              <Avatar>
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                                />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.role}
                                </p>
                              </div>
                            </div>
                          ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <ChatList
          chats={filteredChats}
          selectedChatId={selectedChat}
          onChatSelect={setSelectedChat}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {chats.find((c) => c.id === selectedChat)?.name}
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(messages[selectedChat] || []).map((message, index, arr) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    showAvatar={
                      index === arr.length - 1 ||
                      arr[index + 1]?.senderId !== message.senderId
                    }
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={
                    !isDirectMessage(selectedChat) &&
                    !canSendToGroup(selectedChat)
                  }
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.trim() ||
                    (!isDirectMessage(selectedChat) &&
                      !canSendToGroup(selectedChat))
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

const demoUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "System Administrator",
    status: "Active",
  },
  {
    id: "2",
    name: "Director Smith",
    email: "director@example.com",
    role: "Director",
    status: "Active",
  },
  {
    id: "3",
    name: "Mr. James Brown",
    email: "james@example.com",
    role: "House Master",
    status: "Active",
  },
  {
    id: "4",
    name: "Ms. Jane Wilson",
    email: "jane@example.com",
    role: "Deputy House Master",
    status: "Active",
  },
  {
    id: "5",
    name: "Support Staff",
    email: "support@example.com",
    role: "Support Staff",
    status: "Active",
  },
  {
    id: "6",
    name: "Head Prefect",
    email: "prefect@example.com",
    role: "Prefect",
    status: "Active",
  },
  {
    id: "7",
    name: "Dr. Sarah Wilson",
    email: "sarah@example.com",
    role: "Medical Staff",
    status: "Active",
  },
  {
    id: "8",
    name: "Chef Johnson",
    email: "chef@example.com",
    role: "Kitchen Staff",
    status: "Active",
  },
  {
    id: "9",
    name: "Mrs. Smith",
    email: "parent@example.com",
    role: "Boarder Parent",
    status: "Active",
  },
  {
    id: "10",
    name: "John Smith",
    email: "john@example.com",
    role: "Boarder",
    status: "Active",
  },
];

export default MessagingPanel;
