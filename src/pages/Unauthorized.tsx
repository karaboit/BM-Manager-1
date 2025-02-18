import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold">Unauthorized Access</h1>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}
