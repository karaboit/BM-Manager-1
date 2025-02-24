import { useState, useEffect } from "react";
import { ConnectionManager } from "../supabase/ConnectionManager";

export function useSupabaseConnection() {
  const [status, setStatus] = useState(
    ConnectionManager.getInstance().getStatus(),
  );
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const manager = ConnectionManager.getInstance();

    const handleStatusChange = (newStatus: string) => {
      setStatus(newStatus);
      if (newStatus === "error") {
        setError(new Error("Failed to connect to database"));
      } else {
        setError(null);
      }
    };

    manager.addListener(handleStatusChange);
    manager.connect().catch((err) => setError(err));

    return () => {
      manager.removeListener(handleStatusChange);
    };
  }, []);

  return { status, error, isConnected: status === "connected" };
}
