import { createContext, useContext } from 'react';

export interface UserContextType {
  userId: string | null;
  email: string | null;
  role: string | null;
  setUser: (user: { userId: string | null; email: string | null; role: string | null }) => void;
}

// Provide a default context with no-op for setUser
export const UserContext = createContext<UserContextType>({
  userId: null,
  email: null,
  role: null,
  setUser: () => {}
});

export const useUser = () => useContext(UserContext);
