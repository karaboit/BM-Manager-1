import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Plus, Search, Users } from "lucide-react";
import { useDashboardStore } from "@/lib/store";
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

interface Chat {
  id: string;
  type: "group" | "direct";
  name: string;
  role?: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  allowedRoles?: string[];
}

interface Message {
  id: string;
  sender: {
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
}

const defaultChats: Chat[] = [
  {
    id: "announcements",
    type: "group",
    name: "General Announcements",
    role: "System",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Announcements",
    lastMessage: "Good morning everyone!",
    timestamp: "08:00 AM",
    unread: 2,
    allowedRoles: [
      "System Administrator",
      "House Master",
      "Deputy House Master",
    ],
  },
  {
    id: "medical",
    type: "group",
    name: "Medical Updates",
    role: "Medical Staff",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Medical",
    lastMessage: "Flu vaccination schedule posted",
    timestamp: "09:15 AM",
    allowedRoles: ["Medical Staff", "System Administrator", "House Master"],
  },
  {
    id: "kitchen",
    type: "group",
    name: "Kitchen Updates",
    role: "Kitchen Staff",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kitchen",
    lastMessage: "Today's menu update",
    timestamp: "02:30 PM",
    allowedRoles: ["Kitchen Staff", "System Administrator"],
  },
];

const defaultMessages: Record<string, Message[]> = {
  announcements: [
    {
      id: "1",
      sender: {
        name: "House Master",
        role: "House Master",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HouseMaster",
      },
      content:
        "Good morning everyone! Remember to complete your room inspection before breakfast.",
      timestamp: "08:00 AM",
    },
  ],
  medical: [
    {
      id: "2",
      sender: {
        name: "Medical Staff",
        role: "Medical Staff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Medical",
      },
      content: "Flu vaccination schedule has been posted on the medical board.",
      timestamp: "09:15 AM",
    },
  ],
  kitchen: [
    {
      id: "3",
      sender: {
        name: "Kitchen Staff",
        role: "Kitchen Staff",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kitchen",
      },
      content:
        "Today's dinner menu: Grilled chicken, roasted vegetables, and rice.",
      timestamp: "02:30 PM",
    },
  ],
};

const AnnouncementPanel = () => {
  const [chats, setChats] = useState<Chat[]>(defaultChats);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(defaultMessages);
  const [selectedChat, setSelectedChat] = useState<string>("announcements");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newChatName, setNewChatName] = useState("");
  const [searchResults, setSearchResults] = useState<
    { name: string; role: string }[]
  >([]);
  const { currentUser } = useDashboardStore();

  const canSendToGroup = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat?.allowedRoles?.includes(currentUser?.role || "");
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Simulated user search - in real app, this would be an API call
    const results = [
      { name: "John Smith", role: "House Master" },
      { name: "Jane Doe", role: "Medical Staff" },
      { name: "Bob Wilson", role: "Kitchen Staff" },
    ].filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchResults(results);
  };

  const handleCreateDirectMessage = (selectedUser?: {
    name: string;
    role: string;
  }) => {
    if (!selectedUser && !newChatName.trim()) return;

    const chatName = selectedUser?.name || newChatName;
    const newChat: Chat = {
      id: Date.now().toString(),
      type: "direct",
      name: chatName,
      role: selectedUser?.role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatName}`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats((prev) => [...prev, newChat]);
    setMessages((prev) => ({ ...prev, [newChat.id]: [] }));
    setSelectedChat(newChat.id);
    setNewChatName("");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`,
      },
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), message],
    }));
    setNewMessage("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // All users can create messages
  const canCreateMessage = true;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {canCreateMessage && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <Select
                      onValueChange={(value) => {
                        const group = defaultChats.find((c) => c.id === value);
                        if (group) {
                          handleCreateDirectMessage({
                            name: group.name,
                            role: group.role || "",
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultChats
                          .filter(
                            (chat) =>
                              chat.type === "group" &&
                              chat.allowedRoles?.includes(
                                currentUser?.role || "",
                              ),
                          )
                          .map((chat) => (
                            <SelectItem key={chat.id} value={chat.id}>
                              {chat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <p className="text-sm text-muted-foreground mb-2">
                        Or search for a user:
                      </p>
                      <Input
                        placeholder="Search users..."
                        value={newChatName}
                        onChange={(e) => {
                          setNewChatName(e.target.value);
                          handleSearch(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="border rounded-md max-h-48 overflow-y-auto">
                      {searchResults.map((user, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                          onClick={() => {
                            handleCreateDirectMessage(user);
                            setSearchResults([]);
                            setNewChatName("");
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
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
                    </div>
                  )}
                  <Button
                    onClick={() => handleCreateDirectMessage()}
                    className="w-full"
                  >
                    Create Chat
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-accent ${selectedChat === chat.id ? "bg-accent" : ""}`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{chat.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {chat.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat && (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={chats.find((c) => c.id === selectedChat)?.avatar}
                  />
                  <AvatarFallback>
                    {chats.find((c) => c.id === selectedChat)?.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {chats.find((c) => c.id === selectedChat)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {chats.find((c) => c.id === selectedChat)?.role}
                  </p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages[selectedChat]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender.name === currentUser?.name ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender.name !== currentUser?.name && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback>
                          {message.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${message.sender.name === currentUser?.name ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {message.sender.name}
                          </span>
                          <span className="text-xs opacity-70">
                            {message.sender.role}
                          </span>
                        </div>
                        <p className="mt-1">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                    {message.sender.name === currentUser?.name && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback>
                          {message.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            {(canSendToGroup(selectedChat) ||
              chats.find((c) => c.id === selectedChat)?.type === "direct") && (
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPanel;
