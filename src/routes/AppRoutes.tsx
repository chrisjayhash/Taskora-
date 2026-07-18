import { Routes, Route, Link, Navigate } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import DepositPage from "../pages/Deposit/DepositPage";
import BrowseTasksPage from "../pages/Tasks/BrowseTasksPage";
import TaskDetailPage from "../pages/Tasks/TaskDetailPage";
import SubmissionsPage from "../pages/Submissions/SubmissionsPage";
import { isAuthenticated } from "../lib/auth-storage";

function RequireAuth({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RedirectIfAuth({ children }: { children: JSX.Element }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes — redirect away if already authenticated */}
      <Route
        path="/"
        element={
          <RedirectIfAuth>
            <LandingPage />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <LoginPage />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuth>
            <SignUpPage />
          </RedirectIfAuth>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />

      <Route
        path="/deposit"
        element={
          <RequireAuth>
            <DepositPage />
          </RequireAuth>
        }
      />

      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <BrowseTasksPage />
          </RequireAuth>
        }
      />

      <Route
        path="/tasks/:id"
        element={
          <RequireAuth>
            <TaskDetailPage />
          </RequireAuth>
        }
      />
      
      <Route
  path="/submissions"
  element={
    <RequireAuth>
      <SubmissionsPage />
    </RequireAuth>
  }
/>

      {/* Fallback 404 Route */}
      <Route
        path="*"
        element={
          <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground my-2">Page not found</p>
            <Link to="/" className="text-primary underline">Go back home</Link>
          </div>
        }
      />
    </Routes>
  );
}
