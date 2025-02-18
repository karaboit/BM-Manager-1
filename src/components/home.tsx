import React from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import MainContent from "./dashboard/MainContent";
import { useDashboardStore } from "@/lib/store";
import ChildSelector from "./dashboard/ChildSelector";

const Home = () => {
  const { activePanel, setActivePanel, currentUser } = useDashboardStore();

  const handleNavigate = (panel: string) => {
    setActivePanel(panel as any);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
  };

  const handleSettingsClick = () => {
    setActivePanel("config");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activePage={activePanel}
        onNavigate={handleNavigate}
        userName={currentUser?.name || "Admin User"}
        userRole={currentUser?.role || "System Administrator"}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        {currentUser?.role === "Boarder Parent" && <ChildSelector />}
        <Header
          onLogout={handleLogout}
          onSettingsClick={handleSettingsClick}
          userName={currentUser?.name || "Admin User"}
          userEmail={currentUser?.email || "admin@example.com"}
        />
        <MainContent activePanel={activePanel} />
      </div>
    </div>
  );
};

export default Home;
