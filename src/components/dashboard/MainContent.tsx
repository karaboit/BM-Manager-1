import React, { useState } from "react";
import { useDashboardStore } from "@/lib/store";
import BoarderDashboard from "./panels/BoarderDashboard";
import UserManagementPanel from "./panels/UserManagementPanel";
import ConfigPanel from "./panels/ConfigPanel";
import AuditLogPanel from "./panels/AuditLogPanel";
import MaintenancePanel from "./panels/MaintenancePanel";
import AnnouncementPanel from "./panels/AnnouncementPanel";
import MedicalPanel from "./panels/MedicalPanel";
import RoomPanel from "./panels/RoomPanel";
import AttendancePanel from "./panels/AttendancePanel";
import LeavePanel from "./panels/LeavePanel";
import DisciplinePanel from "./panels/DisciplinePanel";
import WellbeingPanel from "./panels/WellbeingPanel";
import KitchenPanel from "./panels/KitchenPanel";
import DirectorDashboard from "./panels/DirectorDashboard";

type ActivePanel =
  | "dashboard"
  | "users"
  | "config"
  | "audit"
  | "maintenance"
  | "announcements"
  | "medical"
  | "rooms"
  | "kitchen"
  | "attendance"
  | "leave"
  | "discipline"
  | "wellbeing";

interface MainContentProps {
  activePanel?: ActivePanel;
}

const MainContent: React.FC<MainContentProps> = ({
  activePanel = "dashboard",
}) => {
  const currentPanel = activePanel;
  const [loading, setLoading] = useState(false);
  const { currentUser } = useDashboardStore();

  const renderPanel = () => {
    // Show appropriate dashboard based on user role
    if (currentPanel === "dashboard") {
      if (currentUser?.role === "Boarder" || currentUser?.role === "Prefect") {
        return <BoarderDashboard />;
      } else if (currentUser?.role === "Kitchen Staff") {
        return <KitchenPanel showDashboard={true} />;
      } else if (
        currentUser?.role === "Director" ||
        currentUser?.role === "House Master" ||
        currentUser?.role === "Deputy House Master"
      ) {
        return <DirectorDashboard />;
      } else {
        return <UserManagementPanel />;
      }
    }

    // For kitchen staff, show kitchen panel when selected
    if (currentUser?.role === "Kitchen Staff" && currentPanel === "kitchen") {
      return <KitchenPanel showDashboard={false} />;
    }
    switch (currentPanel) {
      case "dashboard":
        return <BoarderDashboard />;
      case "users":
        return <UserManagementPanel />;
      case "config":
        return <ConfigPanel />;
      case "audit":
        return <AuditLogPanel />;
      case "maintenance":
        return <MaintenancePanel />;
      case "announcements":
        return <AnnouncementPanel />;
      case "medical":
        // Only show medical info for medical staff, boarders (their own), and parents (their child)
        // Show medical info for medical staff, boarders (their own), parents (their children), and house management
        if (
          currentUser?.role === "Medical Staff" ||
          currentUser?.role === "House Master" ||
          currentUser?.role === "Deputy House Master" ||
          currentUser?.role === "Boarder" ||
          currentUser?.role === "Prefect" ||
          currentUser?.role === "Boarder Parent"
        ) {
          return (
            <MedicalPanel
              boarderId={
                currentUser?.role === "Boarder" ? currentUser.id : undefined
              }
            />
          );
        }
        return (
          <div className="p-6">You do not have access to medical records.</div>
        );
      case "rooms":
        return <RoomPanel />;
      case "attendance":
        return <AttendancePanel />;
      case "leave":
        return <LeavePanel />;
      case "discipline":
        return <DisciplinePanel />;
      case "kitchen":
        return <KitchenPanel />;
      case "wellbeing":
        return <WellbeingPanel />;
      default:
        return <UserManagementPanel />;
    }
  };

  return (
    <div className="flex-1 p-4 bg-gray-100 overflow-auto">{renderPanel()}</div>
  );
};

export default MainContent;
