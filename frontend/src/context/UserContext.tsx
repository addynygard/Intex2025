import { createContext, useContext } from 'react';

interface UserContextType {
  userId: number | null;
}

export const UserContext = createContext<UserContextType>({ userId: null });

export const useUser = () => useContext(UserContext);
