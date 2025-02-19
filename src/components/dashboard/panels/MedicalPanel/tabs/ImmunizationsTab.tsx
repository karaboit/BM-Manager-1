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
import { Immunization } from "@/types";
import { useDashboardStore } from "@/lib/store";

const defaultImmunizations: Immunization[] = [];

const ImmunizationsTab = () => {
  const [isNewImmunizationOpen, setIsNewImmunizationOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const canEdit = currentUser?.role === "Medical Staff";
  const [newImmunization, setNewImmunization] = useState({
    boarder_id: "",
    vaccine_name: "",
    immunization_date: "",
    notes: "",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Immunization Records</h2>
        {canEdit && (
          <Dialog
            open={isNewImmunizationOpen}
            onOpenChange={setIsNewImmunizationOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Immunization
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Immunization Record</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="boarder_id">Boarder ID</Label>
                  <Input
                    id="boarder_id"
                    value={newImmunization.boarder_id}
                    onChange={(e) =>
                      setNewImmunization({
                        ...newImmunization,
                        boarder_id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vaccine_name">Vaccine Name</Label>
                  <Input
                    id="vaccine_name"
                    value={newImmunization.vaccine_name}
                    onChange={(e) =>
                      setNewImmunization({
                        ...newImmunization,
                        vaccine_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="immunization_date">Date</Label>
                  <Input
                    id="immunization_date"
                    type="date"
                    value={newImmunization.immunization_date}
                    onChange={(e) =>
                      setNewImmunization({
                        ...newImmunization,
                        immunization_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newImmunization.notes}
                    onChange={(e) =>
                      setNewImmunization({
                        ...newImmunization,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewImmunizationOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("New immunization:", newImmunization);
                    setIsNewImmunizationOpen(false);
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
            <TableHead>Vaccine</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defaultImmunizations.map((immunization) => (
            <TableRow key={immunization.immunization_id}>
              <TableCell>{immunization.boarder_id}</TableCell>
              <TableCell>{immunization.vaccine_name}</TableCell>
              <TableCell>{immunization.immunization_date}</TableCell>
              <TableCell>{immunization.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ImmunizationsTab;
