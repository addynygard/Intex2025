import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { JSX } from 'react';

type Props = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: Props) => {
  const { userId, role, loading } = useUser();

  if (loading) return <div>Loading...</div>; // Or a spinner

  const isUser = role?.includes('User');

  if (!userId) return <Navigate to="/Login" replace />;
  if (!isUser) return <Navigate to="/Movie" replace />;

  return children;
};

export default PrivateRoute;
