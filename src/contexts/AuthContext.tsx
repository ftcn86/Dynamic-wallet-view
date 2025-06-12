
"use client"

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/data/schemas';
// mockUser is not needed here for default state if we're relying on localStorage or login to populate.

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean; // For initial app authentication state loading
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PI_PULSE_USER_KEY = 'piPulseUser';

// Helper for deep equality check for User object
const areUsersEqual = (userA: User | null, userB: User | null): boolean => {
  if (userA === userB) return true; // Same reference or both null
  if (!userA || !userB) return false; // One is null, other isn't

  // Using JSON.stringify for a simple deep comparison suitable for this app's User schema.
  try {
    return JSON.stringify(userA) === JSON.stringify(userB);
  } catch (error) {
    console.error("Error comparing user objects:", error);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, _setUserInternal] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // True until initial auth status is determined from localStorage

  useEffect(() => {
    // Simulate determining initial authentication status by checking localStorage
    try {
      const storedUserItem = localStorage.getItem(PI_PULSE_USER_KEY);
      if (storedUserItem) {
        const storedUser = JSON.parse(storedUserItem) as User;
        _setUserInternal(storedUser);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      // If parsing fails or any error, ensure localStorage item is cleared to prevent cycles
      localStorage.removeItem(PI_PULSE_USER_KEY);
    }
    setIsLoading(false);
  }, []); // Empty dependency array ensures this runs only once on mount

  const setUser: Dispatch<SetStateAction<User | null>> = useCallback((newUserValue) => {
    _setUserInternal(currentUser => {
      const resolvedNewUser = typeof newUserValue === 'function'
        ? (newUserValue as (prevState: User | null) => User | null)(currentUser)
        : newUserValue;

      // Only update and persist if the new user is actually different from the current one
      if (!areUsersEqual(currentUser, resolvedNewUser)) {
        try {
          if (resolvedNewUser) {
            localStorage.setItem(PI_PULSE_USER_KEY, JSON.stringify(resolvedNewUser));
          } else {
            localStorage.removeItem(PI_PULSE_USER_KEY);
          }
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
        }
        return resolvedNewUser;
      }
      return currentUser; // Return current state to prevent re-render and re-save
    });
  }, []);


  const logout = useCallback(() => {
    // The logic related to PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY was here.
    // Since the key and feature are removed, this part is no longer needed.
    setUser(null); // This will call the updated setUser, which handles removing from localStorage
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
