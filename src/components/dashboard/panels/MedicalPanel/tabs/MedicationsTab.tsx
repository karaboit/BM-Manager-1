import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { MedicationSchedule, MedicationLog } from "@/types";
import { useDashboardStore } from "@/lib/store";

const defaultSchedules: MedicationSchedule[] = [];
const defaultLogs: MedicationLog[] = [];

const MedicationsTab = () => {
  const [isNewScheduleOpen, setIsNewScheduleOpen] = useState(false);
  const [isNewLogOpen, setIsNewLogOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const canEdit = currentUser?.role === "Medical Staff";

  const [newSchedule, setNewSchedule] = useState({
    boarder_id: "",
    medicine_name: "",
    dosage: "",
    frequency: "",
    start_date: "",
    end_date: "",
  });
  const [newLog, setNewLog] = useState({
    med_schedule_id: "",
    dose_time: "",
    status: "taken" as const,
    notes: "",
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Medication Schedules</h2>
          {canEdit && (
            <Dialog
              open={isNewScheduleOpen}
              onOpenChange={setIsNewScheduleOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Medication Schedule</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="boarder_id">Boarder ID</Label>
                    <Input
                      id="boarder_id"
                      value={newSchedule.boarder_id}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          boarder_id: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="medicine_name">Medicine Name</Label>
                    <Input
                      id="medicine_name"
                      value={newSchedule.medicine_name}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          medicine_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      value={newSchedule.dosage}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          dosage: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input
                      id="frequency"
                      value={newSchedule.frequency}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          frequency: e.target.value,
                        })
                      }
                      placeholder="e.g. Twice daily"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newSchedule.start_date}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          start_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={newSchedule.end_date}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          end_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewScheduleOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("New schedule:", newSchedule);
                      setIsNewScheduleOpen(false);
                    }}
                  >
                    Save Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boarder ID</TableHead>
              <TableHead>Medicine</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaultSchedules.map((schedule) => (
              <TableRow key={schedule.med_schedule_id}>
                <TableCell>{schedule.boarder_id}</TableCell>
                <TableCell>{schedule.medicine_name}</TableCell>
                <TableCell>{schedule.dosage}</TableCell>
                <TableCell>{schedule.frequency}</TableCell>
                <TableCell>{schedule.start_date}</TableCell>
                <TableCell>{schedule.end_date || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Medication Logs</h2>
          {canEdit && (
            <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Dose
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Medication Dose</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="med_schedule_id">Schedule ID</Label>
                    <Input
                      id="med_schedule_id"
                      value={newLog.med_schedule_id}
                      onChange={(e) =>
                        setNewLog({
                          ...newLog,
                          med_schedule_id: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dose_time">Time</Label>
                    <Input
                      id="dose_time"
                      type="datetime-local"
                      value={newLog.dose_time}
                      onChange={(e) =>
                        setNewLog({ ...newLog, dose_time: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <RadioGroup
                      value={newLog.status}
                      onValueChange={(value) =>
                        setNewLog({
                          ...newLog,
                          status: value as "taken" | "missed" | "refused",
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="taken" id="taken" />
                        <Label htmlFor="taken">Taken</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="missed" id="missed" />
                        <Label htmlFor="missed">Missed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="refused" id="refused" />
                        <Label htmlFor="refused">Refused</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newLog.notes}
                      onChange={(e) =>
                        setNewLog({ ...newLog, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewLogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("New log:", newLog);
                      setIsNewLogOpen(false);
                    }}
                  >
                    Save Log
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schedule ID</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaultLogs.map((log) => (
              <TableRow key={log.log_id}>
                <TableCell>{log.med_schedule_id}</TableCell>
                <TableCell>
                  {new Date(log.dose_time).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      log.status === "taken"
                        ? "bg-green-100 text-green-800"
                        : log.status === "missed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </TableCell>
                <TableCell>{log.staff_id}</TableCell>
                <TableCell>{log.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicationsTab;
