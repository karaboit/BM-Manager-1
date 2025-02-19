import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Boarder {
  id: string;
  name: string;
  room: string;
  avatar?: string;
}

interface BoarderListProps {
  boarders: Boarder[];
  selectedBoarderId?: string;
  onBoarderSelect: (boarderId: string) => void;
}

const defaultBoarders: Boarder[] = [];

const BoarderList = ({
  boarders = defaultBoarders,
  selectedBoarderId,
  onBoarderSelect,
}: BoarderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBoarders = boarders.filter(
    (boarder) =>
      boarder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boarder.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boarder.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <Card className="w-[300px] h-full">
      <CardHeader>
        <CardTitle>Boarders</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search boarders..."
            className="pl-8"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {filteredBoarders.map((boarder) => (
              <div
                key={boarder.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${selectedBoarderId === boarder.id ? "bg-accent" : ""}`}
                onClick={() => onBoarderSelect(boarder.id)}
              >
                <Avatar>
                  <AvatarImage src={boarder.avatar} />
                  <AvatarFallback>{boarder.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{boarder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {boarder.room}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BoarderList;
