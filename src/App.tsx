import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Home from "@/components/home";
import LoginPage from "@/components/auth/LoginPage";
import Unauthorized from "@/pages/Unauthorized";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-background">
        {import.meta.env.VITE_TEMPO && useRoutes(routes)}
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
          {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
