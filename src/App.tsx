import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/components/home";
import LoginPage from "@/components/auth/LoginPage";
import Unauthorized from "@/pages/Unauthorized";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
