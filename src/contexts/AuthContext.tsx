
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
          
          // Check if the stored user has valid authentication tokens
          const hasValidTokens = storedUser.accessToken && 
            storedUser.accessToken !== 'mock-token' && 
            storedUser.tokenExpiresAt && 
            storedUser.tokenExpiresAt > Date.now();
            
          if (hasValidTokens) {
            console.log('Found valid cached user session');
            _setUserInternal(storedUser);
          } else {
            console.log('Cached user session expired or invalid, clearing...');
            localStorage.removeItem(DYNAMIC_WALLET_USER_KEY);
            _setUserInternal(null);
          }
        }

        // Then verify with Pi Network SDK if we have a current session
        // Only try this if we're in a Pi Browser environment
        if (typeof window !== 'undefined' && (window as any).Pi) {
          try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              console.log('Found active Pi Network session');
              
              // Load preserved settings if available
              const preservedSettings = localStorage.getItem('dynamic-wallet-settings');
              const defaultSettings: UserSettings = {
                remindersEnabled: true,
                reminderHoursBefore: 1,
              };

              if (preservedSettings) {
                try {
                  const settings = JSON.parse(preservedSettings);
                  currentUser.settings = { ...defaultSettings, ...settings };
                } catch (error) {
                  console.warn('Failed to parse preserved settings:', error);
                  currentUser.settings = defaultSettings;
                }
              } else {
                currentUser.settings = defaultSettings;
              }

              // Preserve terms acceptance from stored user if available
              if (storedUserItem) {
                const storedUser = JSON.parse(storedUserItem) as User;
                currentUser.termsAccepted = storedUser.termsAccepted || currentUser.termsAccepted;
              }

              _setUserInternal(currentUser);
              localStorage.setItem(DYNAMIC_WALLET_USER_KEY, JSON.stringify(currentUser));
            } else {
              console.log('No active Pi Network session found');
            }
          } catch (error) {
            console.error('Error checking Pi Network session:', error);
            // Don't clear stored user on error, just log it
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
      // Check if we're in Pi Browser environment (the only place where real Pi SDK works)
      const isInPiBrowser = typeof window !== 'undefined' && 
        (window as any).Pi && 
        (window as any).Pi.authenticate && 
        typeof (window as any).Pi.authenticate === 'function';

      // Use mock data for all environments except Pi Browser
      if (!isInPiBrowser) {
        console.log('Not in Pi Browser environment: Using mock authentication');
        const mockUser: User = {
          id: 'test-user-123',
          username: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          avatarUrl: '',
          bio: 'Test user for development',
          totalBalance: 12345.6789,
          miningRate: 0.2512,
          isNodeOperator: true,
          balanceBreakdown: {
            transferableToMainnet: 5678.1234,
            totalUnverifiedPi: 4206.7890,
            currentlyInLockups: 3210.7665,
          },
          unverifiedPiDetails: {
            fromReferralTeam: 2000.50,
            fromSecurityCircle: 1000.2890,
            fromNodeRewards: 750.00,
            fromOtherBonuses: 456.0000,
          },
          badges: [],
          termsAccepted: false,
          settings: {
            remindersEnabled: true,
            reminderHoursBefore: 1,
          },
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh',
          tokenExpiresAt: Date.now() + 3600000,
        };

        // Preserve existing settings if available
        const storedUserItem = localStorage.getItem(DYNAMIC_WALLET_USER_KEY);
        if (storedUserItem) {
          const storedUser = JSON.parse(storedUserItem) as User;
          mockUser.termsAccepted = storedUser.termsAccepted || mockUser.termsAccepted;
          mockUser.settings = { ...mockUser.settings, ...storedUser.settings };
        }

        // Load preserved settings if available
        const preservedSettings = localStorage.getItem('dynamic-wallet-settings');
        if (preservedSettings) {
          try {
            const settings = JSON.parse(preservedSettings);
            mockUser.settings = { ...mockUser.settings, ...settings };
            console.log('Restored preserved settings for mock user');
          } catch (error) {
            console.warn('Failed to parse preserved settings for mock user:', error);
          }
        }

        setUser(mockUser);
        return mockUser;
      }

      // Only use real Pi Network SDK if we're actually in Pi Browser
      console.log('Pi Browser detected: Using real Pi Network authentication');
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

      // Load preserved settings if available
      const preservedSettings = localStorage.getItem('dynamic-wallet-settings');
      if (preservedSettings) {
        try {
          const settings = JSON.parse(preservedSettings);
          authenticatedUser.settings = { ...authenticatedUser.settings, ...settings };
          console.log('Restored preserved settings');
        } catch (error) {
          console.warn('Failed to parse preserved settings:', error);
        }
      }

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
      // Preserve only settings in a separate storage
      const storedUserItem = localStorage.getItem(DYNAMIC_WALLET_USER_KEY);
      if(storedUserItem) {
        const storedUser = JSON.parse(storedUserItem) as User;
        if (storedUser.settings) {
          // Store settings separately for future use
          localStorage.setItem('dynamic-wallet-settings', JSON.stringify(storedUser.settings));
        }
      }
      
      // Clear all user session data
      localStorage.removeItem(DYNAMIC_WALLET_USER_KEY);
      
      // Clear any Pi Network session data
      if (typeof window !== 'undefined' && (window as any).Pi) {
        try {
          // Note: Pi Network SDK doesn't have a logout method, 
          // but we can clear our local session
          console.log('Clearing Pi Network session data');
        } catch (error) {
          console.warn('Could not clear Pi Network session:', error);
        }
      }
    } catch (error) {
       console.error("Error during logout:", error);
       // Force clear everything on error
       localStorage.removeItem(DYNAMIC_WALLET_USER_KEY);
       localStorage.removeItem('dynamic-wallet-settings');
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
