
"use client"

import type { Dispatch, ReactNode, SetStateAction} from 'react';
import React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserSettings } from '@/data/schemas';
import { authenticateWithPi, getCurrentUser } from '@/lib/pi-network';

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  login: () => Promise<User | null>;
  logout: () => void;
  // A simple mechanism to trigger data refetches in components
  dataVersion: number;
  refreshData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DYNAMIC_WALLET_USER_KEY = 'dynamicWalletUser';

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
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  // Check for existing Pi Network session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // First check localStorage for cached user
        const storedUserItem = localStorage.getItem(DYNAMIC_WALLET_USER_KEY);
        if (storedUserItem) {
          const storedUser = JSON.parse(storedUserItem) as User;
          _setUserInternal(storedUser);
        }

        // Then verify with Pi Network SDK if we have a current session
        // Only try this if we're in a Pi Browser environment
        if (typeof window !== 'undefined' && (window as any).Pi) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const defaultSettings: UserSettings = {
              remindersEnabled: true,
              reminderHoursBefore: 1,
            };

            // Merge with stored settings if available
            if (storedUserItem) {
              const storedUser = JSON.parse(storedUserItem) as User;
              currentUser.settings = { ...defaultSettings, ...storedUser.settings };
              currentUser.termsAccepted = storedUser.termsAccepted || currentUser.termsAccepted;
            } else {
              currentUser.settings = defaultSettings;
            }

            _setUserInternal(currentUser);
            localStorage.setItem(DYNAMIC_WALLET_USER_KEY, JSON.stringify(currentUser));
          }
        } else {
          console.log('Pi Network SDK not available - running in development mode');
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        // Clear invalid session data
        localStorage.removeItem(DYNAMIC_WALLET_USER_KEY);
        _setUserInternal(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const setUser: Dispatch<SetStateAction<User | null>> = useCallback((newUserValue) => {
    _setUserInternal(currentUser => {
      const resolvedNewUser = typeof newUserValue === 'function'
        ? (newUserValue as (prevState: User | null) => User | null)(currentUser)
        : newUserValue;

      if (!areUsersEqual(currentUser, resolvedNewUser)) {
        try {
          if (resolvedNewUser) {
            localStorage.setItem(DYNAMIC_WALLET_USER_KEY, JSON.stringify(resolvedNewUser));
          } else {
            localStorage.removeItem(DYNAMIC_WALLET_USER_KEY);
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
      // Check if Pi Network SDK is available
      if (typeof window === 'undefined' || !(window as any).Pi) {
        throw new Error('Pi Network SDK not available. Please open this app in the Pi Browser to authenticate.');
      }

      // Use official Pi Network SDK authentication
      const authenticatedUser = await authenticateWithPi();
      
      if (!authenticatedUser) {
        throw new Error('Authentication failed - no user returned');
      }

      const defaultSettings: UserSettings = {
        remindersEnabled: true,
        reminderHoursBefore: 1,
      };

      // Ensure authenticatedUser always has a settings object
      authenticatedUser.settings = { ...defaultSettings, ...authenticatedUser.settings };

      // Preserve existing settings and terms acceptance if user is the same
      const storedUserItem = localStorage.getItem(DYNAMIC_WALLET_USER_KEY);
      if (storedUserItem) {
        const storedUser = JSON.parse(storedUserItem) as User;
        if (storedUser.id === authenticatedUser.id) {
          authenticatedUser.termsAccepted = storedUser.termsAccepted || authenticatedUser.termsAccepted;
          // Merge stored settings, ensuring defaults are present
          authenticatedUser.settings = { ...authenticatedUser.settings, ...storedUser.settings };
        }
      }

      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      console.error("Pi Network login failed:", error);
      setUser(null); // Ensure user is logged out on failure
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    try {
      // Keep user settings but clear session-specific data
      const storedUserItem = localStorage.getItem(DYNAMIC_WALLET_USER_KEY);
      if(storedUserItem) {
        const storedUser = JSON.parse(storedUserItem) as User;
        const settingsToKeep = storedUser.settings;
        const userWithSettings = { ...storedUser, settings: settingsToKeep, termsAccepted: false };
        localStorage.setItem(DYNAMIC_WALLET_USER_KEY, JSON.stringify(userWithSettings));
      }
    } catch (error) {
       console.error("Error preserving settings on logout:", error);
       localStorage.removeItem(DYNAMIC_WALLET_USER_KEY);
    }
    _setUserInternal(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, login, logout, dataVersion, refreshData }}>
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
