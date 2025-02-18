import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Clock, XCircle, Search, Users } from "lucide-react";
import { useDashboardStore } from "@/lib/store";

const defaultBoarders = Array.from({ length: 100 }, (_, i) => ({
  id: `B${String(i + 1).padStart(3, "0")}`,
  name: `Boarder ${i + 1}`,
  room: `${Math.floor(i / 4) + 101}`,
}));

type RollCallType = "Morning" | "Afternoon" | "Evening";
type AttendanceStatus = "Present" | "Late" | "Absent" | "Unmarked";

interface AttendanceRecord {
  status: AttendanceStatus;
  reason?: string;
}

const AttendancePanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rollCallType, setRollCallType] = useState<RollCallType>("Morning");
  const [attendance, setAttendance] = useState<
    Record<RollCallType, Record<string, AttendanceRecord>>
  >({
    Morning: Object.fromEntries(
      defaultBoarders.map((b) => [b.id, { status: "Unmarked" }]),
    ),
    Afternoon: Object.fromEntries(
      defaultBoarders.map((b) => [b.id, { status: "Unmarked" }]),
    ),
    Evening: Object.fromEntries(
      defaultBoarders.map((b) => [b.id, { status: "Unmarked" }]),
    ),
  });
  const [currentRoomFilter, setCurrentRoomFilter] = useState<string>("");

  // Group boarders by room
  const boardersByRoom = defaultBoarders.reduce(
    (acc, boarder) => {
      if (!acc[boarder.room]) acc[boarder.room] = [];
      acc[boarder.room].push(boarder);
      return acc;
    },
    {} as Record<string, typeof defaultBoarders>,
  );

  const rooms = Object.keys(boardersByRoom).sort();

  const handleStatusChange = (boarderId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [rollCallType]: {
        ...prev[rollCallType],
        [boarderId]: { ...prev[rollCallType][boarderId], status },
      },
    }));
  };

  const handleReasonChange = (boarderId: string, reason: string) => {
    setAttendance((prev) => ({
      ...prev,
      [rollCallType]: {
        ...prev[rollCallType],
        [boarderId]: { ...prev[rollCallType][boarderId], reason },
      },
    }));
  };

  const markAllPresent = (room?: string) => {
    setAttendance((prev) => {
      const newAttendance = { ...prev };
      const boardersToMark = room ? boardersByRoom[room] : defaultBoarders;

      boardersToMark.forEach((boarder) => {
        newAttendance[rollCallType][boarder.id] = { status: "Present" };
      });
      return newAttendance;
    });
  };

  const handleSubmit = () => {
    useDashboardStore.getState().setAttendanceRecords(attendance);
    alert(`${rollCallType} attendance submitted successfully`);
    useDashboardStore.getState().setActivePanel("dashboard");
  };

  const getFilteredBoarders = () => {
    const boarders = currentRoomFilter
      ? boardersByRoom[currentRoomFilter]
      : defaultBoarders;
    return boarders.filter(
      (boarder) =>
        boarder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boarder.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const filteredBoarders = getFilteredBoarders();
  const totalBoarders = filteredBoarders.length;
  const presentCount = filteredBoarders.filter(
    (b) => attendance[rollCallType][b.id].status === "Present",
  ).length;
  const lateCount = filteredBoarders.filter(
    (b) => attendance[rollCallType][b.id].status === "Late",
  ).length;
  const absentCount = filteredBoarders.filter(
    (b) => attendance[rollCallType][b.id].status === "Absent",
  ).length;
  const unmarkedCount =
    totalBoarders - (presentCount + lateCount + absentCount);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Take Attendance</h1>
          <select
            className="border rounded-md p-2"
            value={rollCallType}
            onChange={(e) => setRollCallType(e.target.value as RollCallType)}
          >
            <option value="Morning">Morning Roll Call</option>
            <option value="Afternoon">Afternoon Roll Call</option>
            <option value="Evening">Evening Roll Call</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => markAllPresent()}>
            Mark All Present
          </Button>
          <Button onClick={handleSubmit}>Submit Attendance</Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          className="border rounded-md p-2"
          value={currentRoomFilter}
          onChange={(e) => setCurrentRoomFilter(e.target.value)}
        >
          <option value="">All Rooms</option>
          {rooms.map((room) => (
            <option key={room} value={room}>
              Room {room}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBoarders}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-gray-500" />
              Unmarked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{unmarkedCount}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{presentCount}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-yellow-500" />
              Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lateCount}</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <XCircle className="mr-2 h-5 w-5 text-red-500" />
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{absentCount}</div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[calc(100vh-24rem)] border rounded-md bg-white">
        <div className="p-4">
          {(currentRoomFilter ? [currentRoomFilter] : rooms).map((room) => (
            <div key={room} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Room {room}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllPresent(room)}
                >
                  Mark Room Present
                </Button>
              </div>
              <div className="space-y-2">
                {boardersByRoom[room]
                  .filter(
                    (boarder) =>
                      boarder.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      boarder.id
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((boarder) => (
                    <div key={boarder.id} className="flex gap-2">
                      <div
                        className={`flex-1 p-3 rounded-lg border ${attendance[rollCallType][boarder.id].status === "Present" ? "bg-green-100" : attendance[rollCallType][boarder.id].status === "Late" ? "bg-yellow-100" : attendance[rollCallType][boarder.id].status === "Absent" ? "bg-red-100" : "bg-white"} flex items-center justify-between`}
                      >
                        <div>
                          <p className="font-medium">{boarder.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {boarder.id}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              attendance[rollCallType][boarder.id].status ===
                              "Present"
                                ? "bg-green-200"
                                : ""
                            }
                            onClick={() =>
                              handleStatusChange(boarder.id, "Present")
                            }
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              attendance[rollCallType][boarder.id].status ===
                              "Late"
                                ? "bg-yellow-200"
                                : ""
                            }
                            onClick={() =>
                              handleStatusChange(boarder.id, "Late")
                            }
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              attendance[rollCallType][boarder.id].status ===
                              "Absent"
                                ? "bg-red-200"
                                : ""
                            }
                            onClick={() =>
                              handleStatusChange(boarder.id, "Absent")
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {(attendance[rollCallType][boarder.id].status ===
                        "Late" ||
                        attendance[rollCallType][boarder.id].status ===
                          "Absent") && (
                        <Input
                          placeholder="Reason..."
                          value={
                            attendance[rollCallType][boarder.id].reason || ""
                          }
                          onChange={(e) =>
                            handleReasonChange(boarder.id, e.target.value)
                          }
                          className="w-[200px]"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AttendancePanel;
