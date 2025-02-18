import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Boarder {
  id: string;
  name: string;
  room?: string;
}

interface BoarderSelectorProps {
  selectedBoarderId?: string;
  onBoarderSelect: (boarderId: string) => void;
}

// In a real app, this would come from your backend
const defaultBoarders: Boarder[] = [
  { id: "B001", name: "John Smith", room: "Room 101" },
  { id: "B002", name: "Jane Doe", room: "Room 102" },
  { id: "B003", name: "Bob Wilson", room: "Room 103" },
];

const BoarderSelector = ({
  selectedBoarderId,
  onBoarderSelect,
}: BoarderSelectorProps) => {
  return (
    <div className="w-[300px]">
      <Select value={selectedBoarderId} onValueChange={onBoarderSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select a boarder" />
        </SelectTrigger>
        <SelectContent>
          {defaultBoarders.map((boarder) => (
            <SelectItem key={boarder.id} value={boarder.id}>
              {boarder.name} ({boarder.room})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BoarderSelector;
