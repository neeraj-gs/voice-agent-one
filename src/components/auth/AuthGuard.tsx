/**
 * Auth Guard Component
 * Protects routes that require authentication
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, useIsAuthenticated, useAuthLoading } from '../../stores/authStore';
import { Lamp, Legend } from '../system/primitives';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const { isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Show loading while checking auth
  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="flex items-center gap-2.5">
          <Lamp state="ready" pulse />
          <Legend>Checking your session</Legend>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
