import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "../pages/AdminDashboard";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import WebhooksPage from "../pages/WebhooksPage";

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  console.log(isAuthenticated);


  if (!isAuthenticated) {

    return <Routes>
      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetailPage />} />
      <Route path="/webhooks" element={<WebhooksPage />} />

      {user?.role === 'ADMIN' && (
        <>
          <Route path="/admin" element={<AdminDashboard />} />
        </>
      )}

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
