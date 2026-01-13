/**
 * Main App Component
 * Routes and setup flow management
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  TemplateLandingPage,
  LandingPage,
  CallPage,
  DashboardPage,
  SetupPage,
} from './pages';
import { useIsSetupComplete } from './stores/configStore';

// Protected route that requires setup to be complete
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSetupComplete = useIsSetupComplete();

  if (!isSetupComplete) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};

// Home route - shows template landing or redirects to site
const HomeRoute: React.FC = () => {
  const isSetupComplete = useIsSetupComplete();

  if (isSetupComplete) {
    return <Navigate to="/site" replace />;
  }

  return <TemplateLandingPage />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home - Template landing page (marketing) or redirect to site */}
        <Route path="/" element={<HomeRoute />} />

        {/* Template marketing page - always accessible */}
        <Route path="/template" element={<TemplateLandingPage />} />

        {/* Setup wizard - always accessible */}
        <Route path="/setup" element={<SetupPage />} />

        {/* Business site - requires setup */}
        <Route
          path="/site"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />

        {/* Voice agent call page - requires setup */}
        <Route
          path="/call"
          element={
            <ProtectedRoute>
              <CallPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard - requires setup */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
