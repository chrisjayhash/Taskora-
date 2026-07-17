import { Routes, Route, Link, Navigate } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import { isAuthenticated } from "../lib/auth-storage";

// Blocks access to authenticated-only routes (e.g. /dashboard).
// Bounces unauthenticated visitors to /login.
function RequireAuth({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Skips public auth pages (/, /login, /signup) for already-logged-in
// users and sends them straight to /dashboard instead.
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

      {/* Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
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
