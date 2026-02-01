import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CallPage from "./pages/CallPage.jsx";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>

      <Routes>
        <Route
          path="/"
          element={isSignedIn ? <HomePage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/auth"
          element={!isSignedIn ? <AuthPage /> : <Navigate to="/" replace />}
        />

         <Route
          path="/call/:id"
          element={!isSignedIn ? <CallPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="*"
          element={<Navigate to={isSignedIn ? "/" : "/auth"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
