import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/components/home";
import LoginPage from "@/components/auth/LoginPage";
import Unauthorized from "@/pages/Unauthorized";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Toaster } from "@/components/ui/toaster";
import routes from "tempo-routes";

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
            {/* Add this before the catchall route */}
            {import.meta.env.VITE_TEMPO && (
              <Route path="/tempobook/*" element={<Home />} />
            )}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
