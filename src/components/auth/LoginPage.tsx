import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/lib/store";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useDashboardStore();

  const handleLogin = () => {
    // For demo purposes, log in as System Administrator
    // For demo purposes, log in as System Administrator
    const demoUsers = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "System Administrator",
        status: "Active",
      },
      {
        id: "2",
        name: "John Smith",
        email: "john@example.com",
        role: "Boarder",
        status: "Active",
      },
      {
        id: "3",
        name: "Dr. Sarah Wilson",
        email: "sarah@example.com",
        role: "Medical Staff",
        status: "Active",
      },
      {
        id: "4",
        name: "Mr. James Brown",
        email: "james@example.com",
        role: "House Master",
        status: "Active",
      },
      {
        id: "5",
        name: "Mrs. Smith",
        email: "parent@example.com",
        role: "Boarder Parent",
        status: "Active",
      },
    ];

    // For demo, let's use the System Administrator
    setCurrentUser(demoUsers[0]);
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
