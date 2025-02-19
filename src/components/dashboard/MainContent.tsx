import React, { useState, lazy, Suspense } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FadeIn } from "@/components/ui/motion";

const SystemDashboard = lazy(() => import("./panels/SystemDashboard"));
import { useDashboardStore } from "@/lib/store";
import BoarderDashboard from "./panels/BoarderDashboard";
import UserManagementPanel from "./panels/UserManagementPanel";
import ConfigPanel from "./panels/ConfigPanel";
import AuditLogPanel from "./panels/AuditLogPanel";
import MaintenancePanel from "./panels/MaintenancePanel";
import MessagingPanel from "./panels/MessagingPanel";
import MedicalPanel from "./panels/MedicalPanel";
import RoomPanel from "./panels/RoomPanel";
import AttendancePanel from "./panels/AttendancePanel";
import LeavePanel from "./panels/LeavePanel";
import DisciplinePanel from "./panels/DisciplinePanel";
import WellbeingPanel from "./panels/WellbeingPanel";
import EventsPanel from "./panels/EventsPanel";
import KitchenPanel from "./panels/KitchenPanel";
import DirectorDashboard from "./panels/DirectorDashboard";

type ActivePanel =
  | "dashboard"
  | "users"
  | "config"
  | "audit"
  | "maintenance"
  | "messaging"
  | "medical"
  | "rooms"
  | "kitchen"
  | "attendance"
  | "leave"
  | "discipline"
  | "wellbeing"
  | "events";

interface MainContentProps {
  activePanel?: ActivePanel;
}

const MainContent: React.FC<MainContentProps> = ({
  activePanel = "dashboard",
}) => {
  const currentPanel = activePanel;
  const [loading, setLoading] = useState(false);
  const { currentUser, selectedChildId } = useDashboardStore();

  const renderPanel = () => {
    // Show appropriate dashboard based on user role
    if (currentPanel === "dashboard") {
      if (
        currentUser?.role === "Boarder" ||
        currentUser?.role === "Prefect" || // Prefects see the boarder dashboard since they are boarders
        currentUser?.role === "Boarder Parent"
      ) {
        return (
          <BoarderDashboard
            isParentView={currentUser?.role === "Boarder Parent"}
            boarder={{
              name: currentUser?.name || "Unknown User",
              room: "", // Will be fetched from DB
              house: "East Wing",
            }}
          />
        );
      } else if (currentUser?.role === "Kitchen Staff") {
        return <KitchenPanel showDashboard={true} />;
      } else if (
        currentUser?.role === "Director" ||
        currentUser?.role === "House Master" ||
        currentUser?.role === "Deputy House Master"
      ) {
        return <DirectorDashboard />;
      } else if (currentUser?.role === "System Administrator") {
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <SystemDashboard />
          </React.Suspense>
        );
      } else {
        return <DirectorDashboard />;
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
      case "messaging":
        return <MessagingPanel />;
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
                currentUser?.role === "Boarder"
                  ? currentUser.id
                  : currentUser?.role === "Boarder Parent"
                    ? selectedChildId
                    : undefined
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
      case "events":
        return <EventsPanel />;
      default:
        return <UserManagementPanel />;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-100 overflow-auto">
      <div className="hidden md:block">
        <Breadcrumb
          items={[
            {
              label: activePanel.charAt(0).toUpperCase() + activePanel.slice(1),
            },
          ]}
        />
      </div>
      <FadeIn>
        <div className="space-y-4 md:space-y-6">{renderPanel()}</div>
      </FadeIn>
    </div>
  );
};

export default MainContent;
