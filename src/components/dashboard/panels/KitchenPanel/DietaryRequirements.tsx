import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";

interface DietaryRequirement {
  boarderId: string;
  name: string;
  restrictions: string[];
  allergies: string[];
  notes?: string;
}

interface DietaryRequirementsProps {
  requirements: DietaryRequirement[];
}

const DietaryRequirements = ({ requirements }: DietaryRequirementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
          Dietary Requirements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Boarder ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Restrictions</TableHead>
              <TableHead>Allergies</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requirements.map((req) => (
              <TableRow key={req.boarderId}>
                <TableCell>{req.boarderId}</TableCell>
                <TableCell>{req.name}</TableCell>
                <TableCell>
                  {req.restrictions.map((restriction, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 mr-1 mb-1"
                    >
                      {restriction}
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  {req.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 rounded-full text-sm bg-red-100 text-red-800 mr-1 mb-1"
                    >
                      {allergy}
                    </span>
                  ))}
                </TableCell>
                <TableCell>{req.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DietaryRequirements;
