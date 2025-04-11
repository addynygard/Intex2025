import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../api/movieAPI';
// User info interface and context
interface User {
  email: string;
  roles?: string[];
}
const UserContext = createContext<User | null>(null);
// === Protected Route Wrapper ===
function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({ email: '' });
  useEffect(() => {
    async function fetchWithRetry(url: string, options: RequestInit) {
      try {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();
        if (data.email) {
          setUser({ email: data.email, roles: data.roles ?? [] });
          setAuthorized(true);
        } else {
          throw new Error('Invalid user session');
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }
    fetchWithRetry(`${API_URL}/pingauth`, {
      method: 'GET',
      credentials: 'include',
    });
  }, []);
  if (loading) {
    // return <FullScreenSpinner />; // :white_check_mark: show loading spinner
  }
  if (authorized) {
    return (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    );
  }
  return <Navigate to="/login" />;
}
// === Hook-style component to display user info ===
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null;
  return props.value === 'email' ? <>{user.email}</> : null;
}
export default AuthorizeView;
