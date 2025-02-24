import React from "react";
import { Card } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useDashboardStore } from "@/lib/store";

// Panel imports
import SystemDashboard from "./panels/SystemDashboard";
import BoarderDashboard from "./panels/BoarderDashboard";
import MentorPanel from "./panels/MentorPanel";
import UserManagementPanel from "./panels/UserManagementPanel";
import ConfigPanel from "./panels/ConfigPanel";
import AuditLogPanel from "./panels/AuditLogPanel";
import MaintenancePanel from "./panels/MaintenancePanel";
import MessagingPanel from "./panels/MessagingPanel";
import RoomPanel from "./panels/RoomPanel";
import AttendancePanel from "./panels/AttendancePanel";
import LeavePanel from "./panels/LeavePanel";
import DisciplinePanel from "./panels/DisciplinePanel";
import WellbeingPanel from "./panels/WellbeingPanel";
import EventsPanel from "./panels/EventsPanel";
import KitchenPanel from "./panels/KitchenPanel";
import DirectorDashboard from "./panels/DirectorDashboard";
import MedicalPanel from "./panels/MedicalPanel";
import MedicalDashboard from "./panels/MedicalDashboard";

type ActivePanel =
  | "dashboard"
  | "users"
  | "config"
  | "audit"
  | "maintenance"
  | "messaging"
  | "rooms"
  | "kitchen"
  | "medical"
  | "attendance"
  | "leave"
  | "discipline"
  | "wellbeing"
  | "events"
  | "mentor";

interface MainContentProps {
  activePanel?: ActivePanel;
}

const MainContent: React.FC<MainContentProps> = ({
  activePanel = "dashboard",
}) => {
  const currentPanel = activePanel;
  const { currentUser } = useDashboardStore();

  const renderPanel = () => {
    // Show appropriate dashboard based on user role
    if (currentPanel === "dashboard") {
      if (!currentUser) return null;

      const userRole =
        typeof currentUser.role === "object"
          ? currentUser.role.role_key
          : currentUser.role;

      if (["boarder", "parent"].includes(userRole)) {
        return (
          <AuthGuard>
            <BoarderDashboard
              isParentView={currentUser.role === "parent"}
              boarder={{
                name: currentUser.name || "Unknown User",
                room: "",
                house: "East Wing",
              }}
            />
          </AuthGuard>
        );
      } else if (userRole === "kitchen") {
        return (
          <AuthGuard requiredRole="kitchen">
            <KitchenPanel showDashboard={true} />
          </AuthGuard>
        );
      } else if (userRole === "medical") {
        return (
          <AuthGuard requiredRole="medical">
            <MedicalDashboard />
          </AuthGuard>
        );
      } else if (
        userRole === "system_administrator" ||
        userRole === "system_admin"
      ) {
        return <SystemDashboard />;
      } else if (
        userRole === "director" ||
        userRole === "house_master" ||
        userRole === "deputy_master"
      ) {
        return (
          <AuthGuard>
            <DirectorDashboard />
          </AuthGuard>
        );
      }
    }

    // For other panels, use AuthGuard with appropriate permissions
    const panelConfig = {
      users: {
        component: <UserManagementPanel />,
        roles: ["system_administrator"],
        permission: "manage_users",
      },
      config: {
        component: <ConfigPanel />,
        roles: ["system_administrator"],
        permission: "manage_system",
      },
      audit: {
        component: <AuditLogPanel />,
        roles: ["system_administrator"],
        permission: "view_audit_logs",
      },
      maintenance: {
        component: <MaintenancePanel />,
        roles: ["system_administrator", "director"],
        permission: "manage_maintenance",
      },
      messaging: {
        component: <MessagingPanel />,
        roles: ["*"], // All roles can access messaging
      },
      rooms: {
        component: <RoomPanel />,
        roles: [
          "system_administrator",
          "director",
          "house_master",
          "deputy_master",
        ],
        permission: "manage_rooms",
      },
      medical: {
        component: <MedicalPanel />,
        roles: ["medical", "system_administrator"],
      },
      attendance: {
        component: <AttendancePanel />,
        roles: [
          "system_administrator",
          "director",
          "house_master",
          "deputy_master",
        ],
        permission: "manage_attendance",
      },
      leave: {
        component: <LeavePanel />,
        roles: [
          "system_administrator",
          "director",
          "house_master",
          "deputy_master",
          "parent",
          "boarder",
        ],
        permission: "manage_leave",
      },
      discipline: {
        component: <DisciplinePanel />,
        roles: [
          "system_administrator",
          "director",
          "house_master",
          "deputy_master",
        ],
        permission: "manage_discipline",
      },
      kitchen: {
        component: <KitchenPanel />,
        roles: ["system_administrator", "kitchen"],
        permission: "manage_kitchen",
      },
      wellbeing: {
        component: <WellbeingPanel />,
        roles: [
          "system_administrator",
          "director",
          "house_master",
          "deputy_master",
          "parent",
          "boarder",
        ],
      },
      events: {
        component: <EventsPanel />,
        roles: ["system_administrator", "director"],
        permission: "manage_events",
      },
      mentor: {
        component: <MentorPanel />,
        roles: ["system_administrator", "house_master", "deputy_master"],
        permission: "manage_mentoring",
      },
    };

    const config = panelConfig[currentPanel as keyof typeof panelConfig];
    if (!config) return null;

    return (
      <AuthGuard
        requiredRole={config.roles}
        requiredPermission={config.permission}
        fallback={<div>Unauthorized: Insufficient permissions</div>}
      >
        {config.component}
      </AuthGuard>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 bg-gray-100 overflow-auto">
      {renderPanel()}
    </div>
  );
};

export default MainContent;
