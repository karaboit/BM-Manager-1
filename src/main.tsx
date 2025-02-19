import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { verifyConnection } from "@/lib/supabase/verify-connection";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools
if (import.meta.env.VITE_TEMPO) {
  TempoDevtools.init();
}

// Initialize Supabase and render app
verifyConnection().then((connected) => {
  if (!connected) {
    console.error("Failed to connect to Supabase");
  } else {
    console.log("Successfully connected to Supabase");
  }

  // Render app regardless of DB status to show error states if needed
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
});
