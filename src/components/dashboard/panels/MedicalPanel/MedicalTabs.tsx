import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Activity, FileText, Syringe, Pill, Heart } from "lucide-react";
import VisitsTab from "./tabs/VisitsTab";
import RecordsTab from "./tabs/RecordsTab";
import ImmunizationsTab from "./tabs/ImmunizationsTab";
import MedicationsTab from "./tabs/MedicationsTab";
import WellbeingHistoryTab from "./tabs/WellbeingHistoryTab";

const MedicalTabs = () => {
  const { currentUser } = useDashboardStore();
  const canEdit = currentUser?.role === "Medical Staff";
  return (
    <Card className="flex-1">
      <Tabs defaultValue="visits" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 flex-wrap">
          <TabsTrigger
            value="visits"
            className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Activity className="mr-2 h-4 w-4" />
            Clinic Visits
          </TabsTrigger>
          <TabsTrigger
            value="records"
            className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <FileText className="mr-2 h-4 w-4" />
            Medical Records
          </TabsTrigger>
          <TabsTrigger
            value="immunizations"
            className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Syringe className="mr-2 h-4 w-4" />
            Immunizations
          </TabsTrigger>
          <TabsTrigger
            value="medications"
            className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Pill className="mr-2 h-4 w-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger
            value="wellbeing"
            className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Heart className="mr-2 h-4 w-4" />
            Wellbeing History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visits" className="p-6">
          <VisitsTab />
        </TabsContent>
        <TabsContent value="records" className="p-6">
          <RecordsTab />
        </TabsContent>
        <TabsContent value="immunizations" className="p-6">
          <ImmunizationsTab />
        </TabsContent>
        <TabsContent value="medications" className="p-6">
          <MedicationsTab />
        </TabsContent>
        <TabsContent value="wellbeing" className="p-6">
          <WellbeingHistoryTab />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MedicalTabs;
