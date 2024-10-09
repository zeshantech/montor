// src/routes/AppRoutes.tsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);
  

  if (!isAuthenticated) {

    return <Routes>
      <Route
        path="/profile"
        element={<Profile />}
      />
      <Route
        path="*"
        element={<Dashboard />}
      />
    </Routes>
  }

  return (
    <Routes>
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="*"
        element={<Login />}
      />
    </Routes>
  );
};
{
  /* Fallback Route */
}
// <Route path="*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

export default AppRoutes;
