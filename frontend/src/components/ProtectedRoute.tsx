import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  userRole: string | null;
  allowedRoles: string[];
  children: JSX.Element;
}

function ProtectedRoute({ userRole, allowedRoles, children }: ProtectedRouteProps) {
  const normalizedUserRole = userRole?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  if (!normalizedUserRole || !normalizedAllowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
