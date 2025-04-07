import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({
  role,
  children,
}: {
  role: string | null;
  children: JSX.Element;
}) {
  if (role !== 'admin') {
    return <Navigate to="/" />; // Redirect non-admin users to the home page
  }
  return children;
}

export default ProtectedRoute;
