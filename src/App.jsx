import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./stores/authStore";

/* Layout & Error Handling */
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

/* ---------------- Lazy Loaded Pages ---------------- */
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Patient */
const PatientDashboard = lazy(() => import("./pages/PatientDashboard"));
const EmergencyRequest = lazy(() => import("./pages/EmergencyRequest"));
const TrackAmbulance = lazy(() => import("./pages/TrackAmbulance"));

/* Staff */
const EMTDashboard = lazy(() => import("./pages/EMTDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const EmergencyQueue = lazy(() => import("./pages/EmergencyQueue"));

/* Medical */
const Telemedicine = lazy(() => import("./pages/Telemedicine"));

/* ---------------- Query Client ---------------- */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

/* ---------------- Loader ---------------- */
const Loader = () => (
  <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
);

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Not logged in → redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // User role not allowed → redirect to home
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  // Allowed → render children
  return children;
};

/* ---------------- App Component ---------------- */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Layout Wrapper */}
              <Route element={<Layout />}>

                {/* Public */}
                <Route path="/" element={<Home />} />

                {/* Patient Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emergency"
                  element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                      <EmergencyRequest />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track/:emergencyId"
                  element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                      <TrackAmbulance />
                    </ProtectedRoute>
                  }
                />

                {/* EMT Routes */}
                <Route
                  path="/emt"
                  element={
                    <ProtectedRoute allowedRoles={["emt"]}>
                      <EMTDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emergency-queue"
                  element={
                    <ProtectedRoute allowedRoles={["emt", "admin"]}>
                      <EmergencyQueue />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Telemedicine */}
                <Route
                  path="/telemedicine/:sessionId"
                  element={
                    <ProtectedRoute>
                      <Telemedicine />
                    </ProtectedRoute>
                  }
                />

              </Route>

              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;