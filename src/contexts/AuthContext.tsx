"use client"

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { User } from '@/data/schemas';

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For login process

  const logout = () => {
    setUser(null);
    // In a real app, you'd also clear tokens, etc.
    // Router redirect will be handled in the component calling logout.
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
