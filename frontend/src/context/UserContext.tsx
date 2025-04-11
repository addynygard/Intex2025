import { createContext, useContext, useState, useEffect } from 'react';

export interface UserContextType {
  userId: number | null;
  email: string | null;
  role: string[] | null;
  setUser: (user: {
    userId: number | null;
    email: string | null;
    role: string[] | null;
  }) => void;
  loading: boolean;
}

export const UserContext = createContext<UserContextType>({
  userId: null,
  email: null,
  role: null,
  setUser: () => {},
  loading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ NEW

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('https://localhost:5000/pingauth', {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.userId ?? null); // fallback if undefined
          setEmail(data.email);
          setRole(data.roles); // make sure backend sends "role" not "roles"
        } else {
          setUserId(null);
          setEmail(null);
          setRole(null);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setUserId(null);
        setEmail(null);
        setRole(null);
      } finally {
        setLoading(false); // ✅ Always stop loading
      }
    };

    fetchUserInfo();
  }, []);

  const setUser = ({
    userId,
    email,
    role,
  }: {
    userId: number | null;
    email: string | null;
    role: string[] | null;
  }) => {
    setUserId(userId);
    setEmail(email);
    setRole(role);
  };

  return (
    <UserContext.Provider value={{ userId, email, role, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
