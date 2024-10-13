import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import Welcome from "../pages/Welcome";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const ProjectsPage = lazy(() => import("../pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("../pages/ProjectDetailPage"));
const WebhooksPage = lazy(() => import("../pages/WebhooksPage"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/webhooks" element={<WebhooksPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
};
{
  /* Fallback Route */
}
// <Route path="*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />

export default AppRoutes;
