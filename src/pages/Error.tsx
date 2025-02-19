import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export interface ErrorPageProps {
  code?: string;
  message?: string;
}

export default function ErrorPage({
  code = "404",
  message = "The page you're looking for doesn't exist.",
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-4">
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-yellow-600">{code}</h1>
        <p className="text-xl text-muted-foreground">{message}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
