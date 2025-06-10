
"use client"

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/data/schemas';

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean; // For initial app authentication state loading
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for deep equality check for User object
const areUsersEqual = (userA: User | null, userB: User | null): boolean => {
  if (userA === userB) return true; // Same reference or both null
  if (!userA || !userB) return false; // One is null, other isn't

  // Using JSON.stringify for a simple deep comparison suitable for this app's User schema.
  // For more complex objects (e.g., with functions, Dates, undefined), a more robust library would be needed.
  try {
    return JSON.stringify(userA) === JSON.stringify(userB);
  } catch (error) {
    // Fallback in case stringification fails (e.g., circular references, though not expected here)
    console.error("Error comparing user objects:", error);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, _setUserInternal] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True until initial auth status is determined

  useEffect(() => {
    // Simulate determining initial authentication status (e.g., checking a token)
    // For this mock app, we just set loading to false after a short delay.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Simulate a quick check
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  const setUser: Dispatch<SetStateAction<User | null>> = useCallback((newUserValue) => {
    _setUserInternal(currentUser => {
      const resolvedNewUser = typeof newUserValue === 'function'
        ? (newUserValue as (prevState: User | null) => User | null)(currentUser)
        : newUserValue;

      // Only update if the new user is actually different from the current one
      if (!areUsersEqual(currentUser, resolvedNewUser)) {
        return resolvedNewUser;
      }
      return currentUser; // Return current state to prevent re-render
    });
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    // setIsLoading(false); // isLoading should already be false after initial load
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
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
