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
import { MedicalInfo } from "@/types";
import { useDashboardStore } from "@/lib/store";

const defaultRecords: MedicalInfo[] = [
  {
    medical_info_id: "1",
    boarder_id: "B001",
    allergies: ["Peanuts", "Penicillin"],
    chronic_conditions: ["Asthma"],
    emergency_contact: "John Doe (Father) - +1234567890",
    created_at: "2024-03-21T10:00:00Z",
    updated_at: "2024-03-21T10:00:00Z",
  },
];

const RecordsTab = () => {
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const canEdit = currentUser?.role === "Medical Staff";
  const [newRecord, setNewRecord] = useState({
    boarder_id: "",
    allergies: [],
    chronic_conditions: [],
    emergency_contact: "",
  });
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        {canEdit && (
          <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Medical Record</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="boarder_id">Boarder ID</Label>
                  <Input
                    id="boarder_id"
                    value={newRecord.boarder_id}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, boarder_id: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Allergies</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newAllergy) {
                          setNewRecord({
                            ...newRecord,
                            allergies: [...newRecord.allergies, newAllergy],
                          });
                          setNewAllergy("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newRecord.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Chronic Conditions</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="Add condition"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newCondition) {
                          setNewRecord({
                            ...newRecord,
                            chronic_conditions: [
                              ...newRecord.chronic_conditions,
                              newCondition,
                            ],
                          });
                          setNewCondition("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newRecord.chronic_conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={newRecord.emergency_contact}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        emergency_contact: e.target.value,
                      })
                    }
                    placeholder="Name (Relation) - Phone"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewRecordOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("New record:", newRecord);
                    setIsNewRecordOpen(false);
                  }}
                >
                  Save Record
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
            <TableHead>Allergies</TableHead>
            <TableHead>Chronic Conditions</TableHead>
            <TableHead>Emergency Contact</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultRecords.map((record) => (
            <TableRow key={record.medical_info_id}>
              <TableCell>{record.boarder_id}</TableCell>
              <TableCell>
                {record.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 rounded-full text-sm bg-red-100 text-red-800 mr-1"
                  >
                    {allergy}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                {record.chronic_conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 mr-1"
                  >
                    {condition}
                  </span>
                ))}
              </TableCell>
              <TableCell>{record.emergency_contact}</TableCell>
              <TableCell>
                {new Date(record.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecordsTab;
