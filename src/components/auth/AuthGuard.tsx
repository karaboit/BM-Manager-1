import { ReactNode } from "react";
import { useAuthorization } from "@/lib/auth/useAuthorization";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string | string[];
  requiredPermission?: string;
  fallback?: ReactNode;
}

export function AuthGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = null,
}: AuthGuardProps) {
  const { hasPermission, canPerformAction } = useAuthorization();

  // Log authorization check
  console.log("AuthGuard check:", {
    requiredRole,
    requiredPermission,
    hasPermission: requiredRole ? hasPermission(requiredRole) : true,
    canPerformAction: requiredPermission
      ? canPerformAction(requiredPermission)
      : true,
  });

  // TEMPORARY: Skip auth checks in development
  if (import.meta.env.DEV) {
    return <>{children}</>;
  }

  const hasAccess =
    (!requiredRole || hasPermission(requiredRole)) &&
    (!requiredPermission || canPerformAction(requiredPermission));

  if (!hasAccess) {
    console.log("Access denied");
    return fallback;
  }

  return <>{children}</>;
}
