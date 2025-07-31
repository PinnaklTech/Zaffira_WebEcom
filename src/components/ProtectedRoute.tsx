
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Show loading during initial auth check
  if (loading) {
    return <Loading message="Authenticating..." />;
  }

  // Check if we have a token in localStorage but no user in state
  // This happens when the page refreshes and Redux state is lost
  const storedToken = localStorage.getItem('auth_token');
  
  // If we have a stored token but no user and not currently loading, 
  // the AuthInitializer should be handling profile fetch
  if (storedToken && !user && !loading) {
    return <Loading message="Restoring session..." />;
  }

  // If no token and no user, redirect to auth
  if (!storedToken && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If we have a token but still no user after loading is complete, something went wrong
  if (storedToken && !user && !loading) {
    localStorage.removeItem('auth_token');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check admin status
  const isAdmin = user?.role === 'admin';

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <div className="animate-fade-in">{children}</div>;
};

export default ProtectedRoute;
