import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { JSX } from 'react';

type Props = {
  children: JSX.Element;
};

const AdminRoute = ({ children }: Props) => {
  const { userId, role, loading } = useUser();

  if (loading) return <div>Loading...</div>; // Or a spinner

  const isAdmin = role?.includes('Admin');

  if (!userId) return <Navigate to="/Login" replace />;
  if (!isAdmin) return <Navigate to="/Movie" replace />;

  return children;
};

export default AdminRoute;
