import { createContext, useContext } from 'react';

export interface UserContextType {
  userId: number | null;

  email: string | null;

  role: string | null;

  setUser: (user: {
    userId: string | null;
    email: string | null;
    role: string | null;
  }) => void;
}

export const UserContext = createContext<UserContextType>({
  userId: 42,

  email: '',

  role: '',

  setUser: () => {},
});

export const useUser = () => useContext(UserContext);
