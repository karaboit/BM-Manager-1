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
import { ClinicVisit } from "@/types";
import { useDashboardStore } from "@/lib/store";

const defaultVisits: ClinicVisit[] = [];

const VisitsTab = () => {
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const canEdit = currentUser?.role === "Medical Staff";
  const [newVisit, setNewVisit] = useState({
    boarder_id: "",
    reason: "",
    vitals: {
      temperature: 37,
      blood_pressure: "120/80",
      pulse: 80,
    },
    treatment: "",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Clinic Visits</h2>
        {canEdit && (
          <Dialog open={isNewVisitOpen} onOpenChange={setIsNewVisitOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Visit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Clinic Visit</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="boarder_id">Boarder ID</Label>
                  <Input
                    id="boarder_id"
                    value={newVisit.boarder_id}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, boarder_id: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    value={newVisit.reason}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, reason: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Vitals</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={newVisit.vitals.temperature}
                        onChange={(e) =>
                          setNewVisit({
                            ...newVisit,
                            vitals: {
                              ...newVisit.vitals,
                              temperature: parseFloat(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="blood_pressure">Blood Pressure</Label>
                      <Input
                        id="blood_pressure"
                        value={newVisit.vitals.blood_pressure}
                        onChange={(e) =>
                          setNewVisit({
                            ...newVisit,
                            vitals: {
                              ...newVisit.vitals,
                              blood_pressure: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="pulse">Pulse</Label>
                      <Input
                        id="pulse"
                        type="number"
                        value={newVisit.vitals.pulse}
                        onChange={(e) =>
                          setNewVisit({
                            ...newVisit,
                            vitals: {
                              ...newVisit.vitals,
                              pulse: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea
                    id="treatment"
                    value={newVisit.treatment}
                    onChange={(e) =>
                      setNewVisit({ ...newVisit, treatment: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewVisitOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("New visit:", newVisit);
                    setIsNewVisitOpen(false);
                  }}
                >
                  Save Visit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Boarder ID</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Vitals</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Staff</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultVisits.map((visit) => (
            <TableRow key={visit.visit_id}>
              <TableCell>
                {new Date(visit.visit_date).toLocaleString()}
              </TableCell>
              <TableCell>{visit.boarder_id}</TableCell>
              <TableCell>{visit.reason}</TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <p>Temp: {visit.vitals.temperature}°C</p>
                  <p>BP: {visit.vitals.blood_pressure}</p>
                  <p>Pulse: {visit.vitals.pulse}</p>
                </div>
              </TableCell>
              <TableCell>{visit.treatment}</TableCell>
              <TableCell>{visit.staff_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VisitsTab;
