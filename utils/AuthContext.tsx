'use client'
import { FC, createContext, useState, ReactNode} from 'react';

interface AuthProviderProps {
    children: ReactNode;
  }

  interface AuthContextType {
    isAuthenticated: boolean;
    setAuthenticated: (value: boolean) => void;
}

export const authContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: (value: boolean) => {
      console.warn('setAuthenticated was called without a Provider');
  },
});

export const AuthProvider:FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const contextValue = {
      isAuthenticated,
      setAuthenticated,
  };
    return (
      <authContext.Provider value={contextValue}>
        {children}
      </authContext.Provider>
    );
};