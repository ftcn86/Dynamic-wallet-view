
"use client"

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserSettings } from '@/data/schemas';
import { getAuthenticatedUser } from '@/services/piService';
import { mockUser } from '@/data/mocks';

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  login: () => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DYNAMIC_PI_WALLET_USER_KEY = 'dynamicPiWalletUser';

const areUsersEqual = (userA: User | null, userB: User | null): boolean => {
  if (userA === userB) return true;
  if (!userA || !userB) return false;
  try {
    return JSON.stringify(userA) === JSON.stringify(userB);
  } catch (error) {
    console.error("Error comparing user objects:", error);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, _setUserInternal] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserItem = localStorage.getItem(DYNAMIC_PI_WALLET_USER_KEY);
      if (storedUserItem) {
        const storedUser = JSON.parse(storedUserItem) as User;
        _setUserInternal(storedUser);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem(DYNAMIC_PI_WALLET_USER_KEY);
    }
    setIsLoading(false);
  }, []);

  const setUser: Dispatch<SetStateAction<User | null>> = useCallback((newUserValue) => {
    _setUserInternal(currentUser => {
      const resolvedNewUser = typeof newUserValue === 'function'
        ? (newUserValue as (prevState: User | null) => User | null)(currentUser)
        : newUserValue;

      if (!areUsersEqual(currentUser, resolvedNewUser)) {
        try {
          if (resolvedNewUser) {
            localStorage.setItem(DYNAMIC_PI_WALLET_USER_KEY, JSON.stringify(resolvedNewUser));
          } else {
            localStorage.removeItem(DYNAMIC_PI_WALLET_USER_KEY);
          }
        } catch (error) {
          console.error("Error saving user to localStorage:", error);
        }
        return resolvedNewUser;
      }
      return currentUser;
    });
  }, []);

  const login = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const fetchedUser = await getAuthenticatedUser();
      
      const defaultSettings: UserSettings = {
        remindersEnabled: true,
        reminderHoursBefore: 1,
      };

      // Ensure fetchedUser always has a settings object
      fetchedUser.settings = { ...defaultSettings, ...fetchedUser.settings };

      const storedUserItem = localStorage.getItem(DYNAMIC_PI_WALLET_USER_KEY);
      if (storedUserItem) {
          const storedUser = JSON.parse(storedUserItem) as User;
          // Preserve settings across logins if user is the same
          if (storedUser.id === fetchedUser.id) {
              fetchedUser.termsAccepted = storedUser.termsAccepted || fetchedUser.termsAccepted;
              // Merge stored settings, ensuring defaults are present
              fetchedUser.settings = { ...fetchedUser.settings, ...storedUser.settings };
          }
      }

      setUser(fetchedUser);
      return fetchedUser;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null); // Ensure user is logged out on failure
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);


  const logout = useCallback(() => {
    // Keep user settings but clear session-specific data
    const storedUserItem = localStorage.getItem(DYNAMIC_PI_WALLET_USER_KEY);
    if(storedUserItem) {
      try {
        const storedUser = JSON.parse(storedUserItem) as User;
        const settingsToKeep = storedUser.settings;
        const userWithSettings = { ...storedUser, settings: settingsToKeep, termsAccepted: false };
        localStorage.setItem(DYNAMIC_PI_WALLET_USER_KEY, JSON.stringify(userWithSettings));
      } catch (error) {
         console.error("Error preserving settings on logout:", error);
         localStorage.removeItem(DYNAMIC_PI_WALLET_USER_KEY);
      }
    }
    _setUserInternal(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, logout }}>
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
