/**
 * Pi Network Integration Module
 * 
 * This module provides a clean, type-safe interface for Pi Network SDK integration.
 * It handles authentication, payments, and API calls following the latest Pi Network best practices.
 * 
 * References:
 * - Pi Platform Docs: https://github.com/pi-apps/pi-platform-docs
 * - Pi SDK: https://github.com/pi-apps/PiOS
 * - Node.js SDK: https://github.com/pi-apps/pi-nodejs
 */

// Pi Network SDK Types
export interface PiAuthResult {
  user: PiUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  auth?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

export interface PiUser {
  uid: string;
  username: string;
  roles: string[];
  credentials?: string;
  app_id?: string;
  receiving_email?: boolean;
  profile?: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  to_address: string;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  transaction: {
    txid: string;
    verified: boolean;
    _link: string;
  } | null;
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
  to_address?: string;
}

// Pi Network Configuration
export interface PiNetworkConfig {
  appId: string;
  apiKey: string;
  sandbox?: boolean;
}

// Environment detection
export const isPiBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).Pi;
};

export const isSandboxMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check URL parameter for sandbox mode
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sandbox') === 'true') return true;
  
  // Check global sandbox flag
  if ((window as any).__PI_SANDBOX_MODE__) return true;
  
  // Check if Pi SDK indicates sandbox mode
  if ((window as any).Pi?.sandbox) return true;
  
  return false;
};

// Pi Network SDK wrapper (Official SDK 2.0)
class PiNetworkSDK {
  private config: PiNetworkConfig;
  private pi: any;

  constructor(config: PiNetworkConfig) {
    this.config = config;
    this.initializeSDK();
  }

  private initializeSDK(): void {
    if (typeof window !== 'undefined' && (window as any).Pi) {
      this.pi = (window as any).Pi;
      
      // Debug: Log available methods
      console.log('Available Pi SDK methods:', Object.keys(this.pi));
      
      // Ensure SDK is initialized with sandbox mode
      if (this.pi.init) {
        this.pi.init({ 
          version: "2.0",
          sandbox: true  // Enable sandbox/testnet mode
        });
      }
    }
  }

  /**
   * Authenticate user with Pi Network (Official SDK 2.0 pattern)
   * @param scopes - Array of permission scopes
   * @param onIncompletePaymentFound - Callback for incomplete payments
   * @returns Promise<PiAuthResult>
   */
  async authenticate(
    scopes: string[] = ['username', 'payments'],
    onIncompletePaymentFound?: (payment: PiPayment) => void
  ): Promise<PiAuthResult> {
    if (!this.pi) {
      throw new Error('Pi Network SDK not available. Please ensure you are running in the Pi Browser.');
    }

    // Check if authenticate method exists
    if (typeof this.pi.authenticate !== 'function') {
      console.error('Pi Network SDK authenticate method not found. Available methods:', Object.keys(this.pi));
      throw new Error('Pi Network SDK authenticate method not available. Please check SDK initialization.');
    }

    try {
      // Use official Pi SDK 2.0 authentication pattern
      const authResult = await this.pi.authenticate(scopes, onIncompletePaymentFound);
      return authResult;
    } catch (error) {
      console.error('Pi Network authentication failed:', error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a payment request (Official SDK 2.0 pattern)
   * @param paymentData - Payment details
   * @param callbacks - Payment callbacks
   * @returns Promise<PiPayment>
   */
  async createPayment(
    paymentData: PiPaymentData,
    callbacks: {
      onReadyForServerApproval: (paymentId: string) => void;
      onReadyForServerCompletion: (paymentId: string, txid: string) => void;
      onCancel: (paymentId: string) => void;
      onError: (error: Error, payment: PiPayment) => void;
    }
  ): Promise<PiPayment> {
    if (!this.pi) {
      throw new Error('Pi Network SDK not available. Please ensure you are running in the Pi Browser.');
    }

    try {
      // Use official Pi SDK 2.0 payment pattern
      const payment = await this.pi.createPayment(paymentData, callbacks);
      return payment;
    } catch (error) {
      console.error('Pi Network payment creation failed:', error);
      throw new Error(`Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete a payment
   * @param payment - Payment object from createPayment
   * @returns Promise<PiPayment>
   */
  async completePayment(payment: PiPayment): Promise<PiPayment> {
    if (!this.pi) {
      throw new Error('Pi Network SDK not available. Please ensure you are running in the Pi Browser.');
    }

    try {
      const completedPayment = await this.pi.completePayment(payment);
      return completedPayment;
    } catch (error) {
      console.error('Pi Network payment completion failed:', error);
      throw new Error(`Payment completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Cancel a payment
   * @param payment - Payment object to cancel
   * @returns Promise<PiPayment>
   */
  async cancelPayment(payment: PiPayment): Promise<PiPayment> {
    if (!this.pi) {
      throw new Error('Pi Network SDK not available. Please ensure you are running in the Pi Browser.');
    }

    try {
      const cancelledPayment = await this.pi.cancelPayment(payment);
      return cancelledPayment;
    } catch (error) {
      console.error('Pi Network payment cancellation failed:', error);
      throw new Error(`Payment cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current user information
   * @returns Promise<PiUser | null>
   */
  async currentUser(): Promise<PiUser | null> {
    if (!this.pi) {
      return null;
    }

    try {
      // The Pi SDK methods are available directly on the Pi object
      // Check if the method exists before calling it
      if (typeof this.pi.currentUser === 'function') {
        return await this.pi.currentUser();
      } else if (typeof this.pi.user === 'function') {
        return await this.pi.user();
      } else {
        console.warn('Pi Network SDK currentUser method not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns Promise<boolean>
   */
  async isAuthenticated(): Promise<boolean> {
    if (!this.pi) {
      return false;
    }

    try {
      // Try different methods to check authentication
      if (typeof this.pi.currentUser === 'function') {
        const user = await this.pi.currentUser();
        return !!user;
      } else if (typeof this.pi.user === 'function') {
        const user = await this.pi.user();
        return !!user;
      } else if (typeof this.pi.isAuthenticated === 'function') {
        return await this.pi.isAuthenticated();
      } else {
        console.warn('Pi Network SDK authentication check method not found');
        return false;
      }
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  }
}

// Pi Network API client for backend communication
export class PiNetworkAPI {
  private config: PiNetworkConfig;
  private baseURL: string;

  constructor(config: PiNetworkConfig) {
    this.config = config;
    this.baseURL = 'https://api.minepi.com/v2';
  }

  /**
   * Validate Pi Network access token
   * @param accessToken - Pi Network access token
   * @returns Promise<boolean>
   */
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Get user balance from Pi Network
   * @param accessToken - Pi Network access token
   * @returns Promise<number>
   */
  async getUserBalance(accessToken: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseURL}/user/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user balance');
      }

      const data = await response.json();
      return data.balance || 0;
    } catch (error) {
      console.error('Failed to get user balance:', error);
      return 0;
    }
  }

  /**
   * Get payment history from Pi Network
   * @param accessToken - Pi Network access token
   * @returns Promise<PiPayment[]>
   */
  async getPaymentHistory(accessToken: string): Promise<PiPayment[]> {
    try {
      const response = await fetch(`${this.baseURL}/payments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      const data = await response.json();
      return data.payments || [];
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  }
}

// Global Pi Network instance
let piSDK: PiNetworkSDK | null = null;
let piAPI: PiNetworkAPI | null = null;

/**
 * Initialize Pi Network SDK
 * @param config - Pi Network configuration
 */
export function initializePiNetwork(config: PiNetworkConfig): void {
  piSDK = new PiNetworkSDK(config);
  piAPI = new PiNetworkAPI(config);
}

/**
 * Get Pi Network SDK instance
 * @returns PiNetworkSDK instance
 */
export function getPiSDK(): PiNetworkSDK {
  if (!piSDK) {
    throw new Error('Pi Network SDK not initialized. Call initializePiNetwork() first.');
  }
  return piSDK;
}

/**
 * Get Pi Network API instance
 * @returns PiNetworkAPI instance
 */
export function getPiAPI(): PiNetworkAPI {
  if (!piAPI) {
    throw new Error('Pi Network API not initialized. Call initializePiNetwork() first.');
  }
  return piAPI;
}

/**
 * Handle incomplete payment found during authentication
 * @param payment - Incomplete payment object
 */
export function handleIncompletePayment(payment: PiPayment): void {
  console.log('Found incomplete payment:', payment);
  
  // In a real app, you would:
  // 1. Show a dialog to the user
  // 2. Ask if they want to complete the payment
  // 3. Call completePayment() if they agree
  
  // For now, we'll just log it
  console.log('Incomplete payment found. User should be prompted to complete it.');
}

/**
 * Format Pi amount for display
 * @param amount - Pi amount
 * @returns Formatted string
 */
export function formatPiAmount(amount: number): string {
  return `${amount.toFixed(2)} π`;
}

/**
 * Convert Pi to USD (mock conversion rate)
 * @param piAmount - Pi amount
 * @returns USD amount
 */
export function piToUSD(piAmount: number): number {
  // Mock conversion rate (in real app, fetch from API)
  const conversionRate = 0.5; // 1 Pi = $0.50
  return piAmount * conversionRate;
}

/**
 * Validate Pi address format
 * @param address - Pi address to validate
 * @returns boolean
 */
export function isValidPiAddress(address: string): boolean {
  // Basic Pi address validation
  return /^[A-Z0-9]{56}$/.test(address);
}

// Default configuration (should be overridden in production)
export const DEFAULT_PI_CONFIG: PiNetworkConfig = {
  appId: process.env.PI_APP_ID || 'dynamic-wallet-view',
  apiKey: process.env.PI_API_KEY || '',
  sandbox: process.env.PI_SANDBOX === 'true' || process.env.NODE_ENV === 'development',
};

// Initialize with default config
if (typeof window !== 'undefined') {
  initializePiNetwork(DEFAULT_PI_CONFIG);
}

// Import our app's User type for mapping
import type { User } from '@/data/schemas';

/**
 * Authenticate user with Pi Network and return our app's User format
 * @returns Promise<User | null>
 */
export async function authenticateWithPi(): Promise<User | null> {
  try {
    // First, check if we're in Pi Browser environment
    if (typeof window === 'undefined' || !(window as any).Pi) {
      throw new Error('Pi Network SDK not available. Please use Pi Browser.');
    }

    const sdk = getPiSDK();
    
    // Authenticate with Pi Network using official SDK
    console.log('🔍 Starting Pi Network authentication...');
    const authResult = await sdk.authenticate(
      ['username', 'payments', 'roles'],
      handleIncompletePayment
    );

    console.log('🔍 Pi Network authentication response:', authResult);
    console.log('🔍 Response type:', typeof authResult);
    console.log('🔍 Response keys:', authResult ? Object.keys(authResult) : 'null');

    if (!authResult) {
      console.error('❌ Authentication failed - authResult is null/undefined');
      throw new Error('Authentication failed - no response returned');
    }

    if (!authResult.user) {
      console.error('❌ Authentication failed - no user in response');
      console.log('🔍 Full authResult structure:', JSON.stringify(authResult, null, 2));
      throw new Error('Authentication failed - no user returned');
    }

    // Validate token with our secure API (only in production)
    if (process.env.NODE_ENV === 'production' && !process.env.PI_SANDBOX) {
      try {
        const validationResponse = await fetch('/api/pi-network/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'validate-token',
            accessToken: authResult.accessToken || authResult.auth?.accessToken || '',
          }),
        });

        if (!validationResponse.ok) {
          console.warn('Token validation failed, but continuing with authentication');
        }
      } catch (validationError) {
        console.warn('Could not validate token with server:', validationError);
      }
    } else {
      console.log('🔍 Skipping token validation in sandbox/development mode');
    }

    // Map Pi Network user to our app's User format
    console.log('🔍 Mapping user data...');
    console.log('🔍 User object:', authResult.user);
    console.log('🔍 User keys:', Object.keys(authResult.user));
    
    if (authResult.user.profile) {
      console.log('🔍 Profile object:', authResult.user.profile);
      console.log('🔍 Profile keys:', Object.keys(authResult.user.profile));
    }

    // Debug: Log all available user data from Pi Network
    console.log('🔍 Full Pi Network user data:', JSON.stringify(authResult.user, null, 2));
    console.log('🔍 User roles:', authResult.user.roles);
    console.log('🔍 User credentials:', authResult.user.credentials);
    console.log('🔍 User app_id:', authResult.user.app_id);
    console.log('🔍 User receiving_email:', authResult.user.receiving_email);

    // Determine if user is a node operator based on roles
    // In Pi Network, node operators typically have specific roles
    const isNodeOperator = authResult.user.roles.includes('node_operator') || 
                          authResult.user.roles.includes('validator') ||
                          authResult.user.roles.includes('super_node') ||
                          authResult.user.roles.includes('node');

    console.log('🔍 Node operator detection:', {
      roles: authResult.user.roles,
      isNodeOperator,
      hasEmailVerified: authResult.user.roles.includes('email_verified'),
      hasKycAccepted: authResult.user.roles.includes('kyc_accepted')
    });

    const user: User = {
      id: authResult.user.uid,
      username: authResult.user.username,
      name: authResult.user.username, // Use username since profile is not available in sandbox
      email: '', // Email not available in sandbox response
      avatarUrl: '', // Will be set from Pi Network or default
      bio: '',
      totalBalance: 0, // Will be fetched separately
      miningRate: 0,
      isNodeOperator, // Now properly determined from roles
      balanceBreakdown: {
        transferableToMainnet: 0,
        totalUnverifiedPi: 0,
        currentlyInLockups: 0,
      },
      unverifiedPiDetails: {
        fromReferralTeam: 0,
        fromSecurityCircle: 0,
        fromNodeRewards: 0,
        fromOtherBonuses: 0,
      },
      badges: [],
      termsAccepted: false, // Will be set based on stored data
      settings: {
        remindersEnabled: true,
        reminderHoursBefore: 1,
      },
      // Pi Network specific fields - handle both sandbox and production response structures
      accessToken: authResult.accessToken || (authResult.auth?.accessToken || ''),
      refreshToken: authResult.refreshToken || (authResult.auth?.refreshToken || ''),
      tokenExpiresAt: authResult.expiresAt || (authResult.auth?.expiresAt || Date.now() + 3600000),
    };

    return user;
  } catch (error) {
    console.error('Pi Network authentication failed:', error);
    return null;
  }
}

/**
 * Get current authenticated user from Pi Network
 * @returns Promise<User | null>
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const sdk = getPiSDK();
    
    // Check if user is authenticated
    const isAuth = await sdk.isAuthenticated();
    if (!isAuth) {
      return null;
    }

    // Get current user from Pi Network
    const piUser = await sdk.currentUser();
    if (!piUser) {
      return null;
    }

    // Map Pi Network user to our app's User format
    const user: User = {
      id: piUser.uid,
      username: piUser.username,
      name: `${piUser.profile?.firstname || ''} ${piUser.profile?.lastname || ''}`,
      email: piUser.profile?.email || '',
      avatarUrl: '', // Will be set from Pi Network or default
      bio: '',
      totalBalance: 0, // Will be fetched separately
      miningRate: 0,
      isNodeOperator: false,
      balanceBreakdown: {
        transferableToMainnet: 0,
        totalUnverifiedPi: 0,
        currentlyInLockups: 0,
      },
      unverifiedPiDetails: {
        fromReferralTeam: 0,
        fromSecurityCircle: 0,
        fromNodeRewards: 0,
        fromOtherBonuses: 0,
      },
      badges: [],
      termsAccepted: false, // Will be set based on stored data
      settings: {
        remindersEnabled: true,
        reminderHoursBefore: 1,
      },
      // Pi Network specific fields (these will be undefined for current user check)
      accessToken: undefined,
      refreshToken: undefined,
      tokenExpiresAt: undefined,
    };

    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
} 