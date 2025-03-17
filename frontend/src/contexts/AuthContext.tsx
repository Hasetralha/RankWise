import React, { createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@example.com',
  name: 'Demo User',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always return authenticated state with mock user
  const auth = {
    user: mockUser,
    isAuthenticated: true,
    login: async () => {
      console.log('Mock login successful');
    },
    register: async () => {
      console.log('Mock register successful');
    },
    logout: () => {
      console.log('Mock logout');
    },
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 