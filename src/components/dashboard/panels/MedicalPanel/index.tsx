import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoarderList from "./BoarderList";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImmunizationsTab from "./tabs/ImmunizationsTab";
import MedicationsTab from "./tabs/MedicationsTab";
import RecordsTab from "./tabs/RecordsTab";
import VisitsTab from "./tabs/VisitsTab";
import WellbeingHistoryTab from "./tabs/WellbeingHistoryTab";

import { useDashboardStore } from "@/lib/store";

const MedicalPanel = () => {
  const { currentUser } = useDashboardStore();
  console.log("Current user in MedicalPanel:", currentUser);

  const userRole =
    typeof currentUser?.role === "object"
      ? currentUser?.role.role_key
      : currentUser?.role;
  console.log("User role:", userRole);
  console.log("Role check:", {
    userRole,
    allowedRoles: ["medical", "system_administrator"],
    hasAccess: ["medical", "system_administrator"].includes(userRole || ""),
  });

  if (!["medical", "system_administrator"].includes(userRole || "")) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have access to medical records.
          </p>
        </div>
      </div>
    );
  }

  const [selectedBoarderId, setSelectedBoarderId] = useState<string | null>(
    null,
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background overflow-hidden">
      <BoarderList
        selectedBoarderId={selectedBoarderId}
        onBoarderSelect={setSelectedBoarderId}
      />

      <div className="flex-1 p-6 overflow-hidden">
        {selectedBoarderId ? (
          <Card className="h-full">
            <Tabs defaultValue="records" className="h-full">
              <TabsList className="w-full justify-start border-b rounded-none px-6">
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="visits">Clinic Visits</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
                <TabsTrigger value="wellbeing">Wellbeing History</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100%-3rem)] p-6">
                <TabsContent value="records" className="m-0">
                  <RecordsTab boarderId={selectedBoarderId} />
                </TabsContent>

                <TabsContent value="visits" className="m-0">
                  <VisitsTab boarderId={selectedBoarderId} />
                </TabsContent>

                <TabsContent value="medications" className="m-0">
                  <MedicationsTab boarderId={selectedBoarderId} />
                </TabsContent>

                <TabsContent value="immunizations" className="m-0">
                  <ImmunizationsTab boarderId={selectedBoarderId} />
                </TabsContent>

                <TabsContent value="wellbeing" className="m-0">
                  <WellbeingHistoryTab boarderId={selectedBoarderId} />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </Card>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a boarder to view medical records
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalPanel;
