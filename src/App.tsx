import { Suspense } from "react";
import { Routes, Route, useRoutes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import routes from "tempo-routes";

// Pages
import Home from "@/components/home";
import LoginPage from "@/components/auth/LoginPage";
import Unauthorized from "@/pages/Unauthorized";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

import { UserSwitcher } from "@/components/UserSwitcher";

function App() {
  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Tempo routes first */}
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* User Switcher for testing */}
          <UserSwitcher />
        </div>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
