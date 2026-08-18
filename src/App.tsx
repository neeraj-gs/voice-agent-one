/**
 * Main App Component
 * Routes and authentication management
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/auth/AuthGuard';
import { Lamp, Legend } from './components/system/primitives';
import { useAuthStore, useIsAuthenticated } from './stores/authStore';
import { useBusinessStore, useActiveBusiness } from './stores/businessStore';

/* Routes are split so a visitor landing on the marketing page does not
   download the charting library, the voice SDK, the OpenAI client and the
   3D renderer before it paints. */
const TemplateLandingPage = lazy(() =>
  import('./pages/TemplateLandingPage').then((m) => ({ default: m.TemplateLandingPage }))
);
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CallPage = lazy(() => import('./pages/CallPage'));
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const SetupPage = lazy(() =>
  import('./pages/SetupPage').then((m) => ({ default: m.SetupPage }))
);
const MyBusinessesPage = lazy(() => import('./pages/MyBusinessesPage'));
const VoiceAgentSettingsPage = lazy(() =>
  import('./pages/VoiceAgentSettingsPage').then((m) => ({ default: m.VoiceAgentSettingsPage }))
);
const PublicLandingPage = lazy(() => import('./pages/PublicLandingPage'));
const PublicCallPage = lazy(() =>
  import('./pages/PublicCallPage').then((m) => ({ default: m.PublicCallPage }))
);
const VoiceAgentDashboard = lazy(() =>
  import('./pages/VoiceAgentDashboard').then((m) => ({ default: m.VoiceAgentDashboard }))
);
const LoginPage = lazy(() =>
  import('./components/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import('./components/auth/SignupPage').then((m) => ({ default: m.SignupPage }))
);

/** Shown between routes. A lamp, not a spinner. */
const RouteFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-ink">
    <span className="flex items-center gap-2.5">
      <Lamp state="ready" pulse />
      <Legend>Loading</Legend>
    </span>
  </div>
);

// Protected route that requires authentication
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

// Route that requires both auth and an active business
const BusinessRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activeBusiness = useActiveBusiness();
  const isAuthenticated = useIsAuthenticated();
  const { user } = useAuthStore();
  const { loadBusinesses, loadActiveBusiness, businesses } = useBusinessStore();

  useEffect(() => {
    if (user && isAuthenticated) {
      loadBusinesses(user.id).then(() => {
        loadActiveBusiness(user.id);
      });
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no active business, redirect to businesses page
  if (!activeBusiness && businesses.length === 0) {
    return <Navigate to="/setup" replace />;
  }

  if (!activeBusiness && businesses.length > 0) {
    return <Navigate to="/businesses" replace />;
  }

  return <>{children}</>;
};

// Home route - shows template landing or redirects based on auth state
const HomeRoute: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { isInitialized } = useAuthStore();

  if (!isInitialized) {
    return null; // Loading
  }

  if (isAuthenticated) {
    return <Navigate to="/businesses" replace />;
  }

  return <TemplateLandingPage />;
};

// Auth initializer component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Home - Template landing page (marketing) or redirect */}
          <Route path="/" element={<HomeRoute />} />

          {/* Public routes */}
          <Route path="/template" element={<TemplateLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Public business pages - no auth required */}
          <Route path="/p/:slug" element={<PublicLandingPage />} />
          <Route path="/p/:slug/call" element={<PublicCallPage />} />

          {/* Setup wizard - requires auth */}
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <SetupPage />
              </ProtectedRoute>
            }
          />

          {/* My Businesses - requires auth */}
          <Route
            path="/businesses"
            element={
              <ProtectedRoute>
                <MyBusinessesPage />
              </ProtectedRoute>
            }
          />

          {/* Business site - requires auth + active business */}
          <Route
            path="/site"
            element={
              <ProtectedRoute>
                <BusinessRoute>
                  <LandingPage />
                </BusinessRoute>
              </ProtectedRoute>
            }
          />

          {/* Voice agent call page - requires auth + active business */}
          <Route
            path="/call"
            element={
              <ProtectedRoute>
                <BusinessRoute>
                  <CallPage />
                </BusinessRoute>
              </ProtectedRoute>
            }
          />

          {/* Dashboard - requires auth + active business */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <BusinessRoute>
                  <DashboardPage />
                </BusinessRoute>
              </ProtectedRoute>
            }
          />

          {/* Voice Agent Settings - requires auth + active business */}
          <Route
            path="/settings/agent"
            element={
              <ProtectedRoute>
                <BusinessRoute>
                  <VoiceAgentSettingsPage />
                </BusinessRoute>
              </ProtectedRoute>
            }
          />

          {/* Voice Agent Dashboard - for agent-only users */}
          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute>
                <BusinessRoute>
                  <VoiceAgentDashboard />
                </BusinessRoute>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </AuthInitializer>
    </BrowserRouter>
  );
};

export default App;
