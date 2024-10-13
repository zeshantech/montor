import { Routes, Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { lazy, Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import Profile from "../pages/Profile";
// import AdminDashboard from "../pages/AdminDashboard";
// import ProjectsPage from "../pages/ProjectsPage";
// import ProjectDetailPage from "../pages/ProjectDetailPage";
// import WebhooksPage from "../pages/WebhooksPage";

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("../pages/ProjectDetailPage"));
const WebhooksPage = lazy(() => import("../pages/WebhooksPage"));

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner size="xl" />
          </Center>
        }
      >
        <Routes>
          <Route path="/profile" element={<Profile />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/webhooks" element={<WebhooksPage />} />

          {user?.role === "ADMIN" && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
            </>
          )}

          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Suspense>
  );
};
{
  /* Fallback Route */
}
// <Route path="*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

export default AppRoutes;
