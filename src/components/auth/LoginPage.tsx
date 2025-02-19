import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser, setAvailablePanels } = useDashboardStore();

  const handleLogin = async () => {
    const adminUser = {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "System Administrator",
      status: "Active",
    };

    const adminPanels = [
      "dashboard",
      "users",
      "rooms",
      "medical",
      "kitchen",
      "attendance",
      "leave",
      "discipline",
      "wellbeing",
      "events",
      "config",
      "audit",
      "maintenance",
      "messaging",
    ];

    setCurrentUser(adminUser);
    setAvailablePanels(adminPanels);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the boarding house management system
          </p>
        </div>
        <Button className="w-full" onClick={handleLogin}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
