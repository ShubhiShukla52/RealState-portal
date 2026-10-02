import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
  /**
   * When true, redirects unauthenticated users to the login route.
   * Kept false by default during Phase 6 UI development so routes remain navigable
   * until real backend/Supabase auth is connected in later phases.
   */
  enforceAuth?: boolean;
}

/**
 * ProtectedRoute component foundation.
 * Structured so real authentication can be plugged in seamlessly without mock state.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = ROUTES.LOGIN,
  enforceAuth = false,
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If auth is loading in future async states
  if (loading) {
    return null;
  }

  // Once real auth is enabled, unauthenticated visitors are redirected to /login
  if (enforceAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
