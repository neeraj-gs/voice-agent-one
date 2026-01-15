/**
 * Main App Component
 * Routes and authentication management
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  TemplateLandingPage,
  LandingPage,
  CallPage,
  DashboardPage,
  SetupPage,
  MyBusinessesPage,
  VoiceAgentSettingsPage,
} from './pages';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { AuthGuard } from './components/auth/AuthGuard';
import { useAuthStore, useIsAuthenticated } from './stores/authStore';
import { useBusinessStore, useActiveBusiness } from './stores/businessStore';

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
        <Routes>
          {/* Home - Template landing page (marketing) or redirect */}
          <Route path="/" element={<HomeRoute />} />

          {/* Public routes */}
          <Route path="/template" element={<TemplateLandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

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

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
};

export default App;
