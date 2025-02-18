import React, { useState } from "react";
import BoarderList from "./MedicalPanel/BoarderList";
import MedicalTabs from "./MedicalPanel/MedicalTabs";
import MedicalDashboard from "./MedicalPanel/MedicalDashboard";
import MedicalOverview from "./MedicalPanel/MedicalOverview";
import { useDashboardStore } from "@/lib/store";

interface MedicalPanelProps {
  boarderId?: string;
}

const MedicalPanel = ({ boarderId }: MedicalPanelProps) => {
  const [selectedBoarderId, setSelectedBoarderId] = useState<string>(
    boarderId || "",
  );
  const { currentUser } = useDashboardStore();
  const [stats] = useState({
    activeVisits: 3,
    pendingMedications: 5,
    criticalAlerts: 1,
    wellbeingAlerts: 2,
  });

  // If user is a boarder, prefect, or parent, they can only see their own/child's records
  if (boarderId || currentUser?.role === "Medical Staff") {
    return (
      <div className="p-6 space-y-6">
        {currentUser?.role === "Medical Staff" && (
          <MedicalDashboard stats={stats} />
        )}
        <div className="flex gap-6">
          {currentUser?.role === "Medical Staff" ? (
            <BoarderList
              boarders={[
                {
                  id: "B001",
                  name: "John Smith",
                  room: "Room 101",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
                },
                {
                  id: "B002",
                  name: "Jane Doe",
                  room: "Room 102",
                  avatar:
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
                },
                {
                  id: "B003",
                  name: "Bob Wilson",
                  room: "Room 103",
                  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
                },
              ]}
              selectedBoarderId={selectedBoarderId}
              onBoarderSelect={setSelectedBoarderId}
            />
          ) : null}
          {selectedBoarderId || boarderId ? (
            <div className="flex-1 space-y-6">
              <MedicalOverview stats={stats} />
              <MedicalTabs />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a boarder to view their medical records
            </div>
          )}
        </div>
      </div>
    );
  } else if (currentUser?.role === "Prefect") {
    // For prefects, directly show their own medical records
    return (
      <div className="p-6 space-y-6">
        <div className="flex-1 space-y-6">
          <MedicalOverview stats={stats} />
          <MedicalTabs />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-center text-muted-foreground">
      You do not have access to medical records.
    </div>
  );
};

export default MedicalPanel;
