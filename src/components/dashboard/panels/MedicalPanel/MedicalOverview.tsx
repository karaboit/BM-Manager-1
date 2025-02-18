import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Pill } from "lucide-react";

interface MedicalOverviewProps {
  stats: {
    activeVisits: number;
    pendingMedications: number;
    criticalAlerts: number;
  };
}

const MedicalOverview = ({ stats }: MedicalOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-blue-500" />
            Active Clinic Visits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.activeVisits}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5 text-yellow-500" />
            Pending Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.pendingMedications}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.criticalAlerts}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalOverview;
