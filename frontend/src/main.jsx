import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./providers/AuthProvide.jsx";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <App />
              <Toaster position="top-right" />
            </AuthProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <div style={{ padding: 24, color: "#fff", background: "#000", minHeight: "100vh" }}>
        <h2>Configuration error</h2>
        <p>
          Missing environment variable <strong>VITE_CLERK_PUBLISHABLE_KEY</strong>.
          Set it in your `.env` (or Vite environment) and restart the dev server.
        </p>
      </div>
    )}
  </StrictMode>
);
