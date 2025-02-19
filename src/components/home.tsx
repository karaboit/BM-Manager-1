import React, { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import MainContent from "./dashboard/MainContent";
import { useDashboardStore } from "@/lib/store";
import ChildSelector from "./dashboard/ChildSelector";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Home = () => {
  const { activePanel, setActivePanel, currentUser, availablePanels } =
    useDashboardStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (panel: string) => {
    setActivePanel(panel as any);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
  };

  const handleSettingsClick = () => {
    setActivePanel("config");
  };

  // Setup keyboard shortcuts
  useKeyboardShortcut({
    "ctrl+k": () => {
      // Toggle command palette (if implemented)
    },
    "ctrl+,": () => setActivePanel("config"),
    "ctrl+h": () => setActivePanel("dashboard"),
    "ctrl+u": () =>
      availablePanels.includes("users") && setActivePanel("users"),
    "ctrl+m": () =>
      availablePanels.includes("medical") && setActivePanel("medical"),
    escape: () => setIsMobileMenuOpen(false),
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activePage={activePanel}
          onNavigate={handleNavigate}
          userName={currentUser?.name || "Admin User"}
          userRole={currentUser?.role || "System Administrator"}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <Sidebar
            activePage={activePanel}
            onNavigate={handleNavigate}
            userName={currentUser?.name || "Admin User"}
            userRole={currentUser?.role || "System Administrator"}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 overflow-hidden">
        {currentUser?.role === "Boarder Parent" && <ChildSelector />}
        <div className="flex items-center md:hidden p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="mr-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
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
