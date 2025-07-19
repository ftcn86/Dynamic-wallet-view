
"use client";

import type { User, TeamMember, NodeData, Transaction, Notification } from '@/data/schemas';
import { getPiSDK, getPiAPI, type PiPayment, type PiPaymentData, isPiBrowser, isSandboxMode, handleIncompletePayment } from '@/lib/pi-network';

// Mock data for development (fallback when Pi Network is not available)
import { mockUser, mockTransactions, mockTeam, mockNodeData, mockNotifications } from '@/data/mocks';

// Mock API call function for development
const mockApiCall = async <T>({ data, delay = 1000 }: { data: T; delay?: number }): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return data;
};

// Payment callback handlers
interface PaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment: PiPayment) => void;
}

// Payment status tracking
interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'failed';
  amount: number;
  memo: string;
  createdAt: string;
  completedAt?: string;
  txid?: string;
}

// In-memory payment tracking (in production, this would be in a database)
const activePayments = new Map<string, PaymentStatus>();

/**
 * Convert Pi Network user to our app's User format
 */
function convertPiUserToAppUser(piUser: any, authResult: any): User {
  return {
    id: piUser.uid,
    username: piUser.username,
    name: `${piUser.profile.firstname} ${piUser.profile.lastname}`,
    email: piUser.profile.email,
    avatarUrl: '',
    bio: '',
    totalBalance: 0,
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
    termsAccepted: false,
    settings: {
      remindersEnabled: true,
      reminderHoursBefore: 1,
    },
    accessToken: authResult.auth.accessToken,
    refreshToken: authResult.auth.refreshToken,
    tokenExpiresAt: authResult.auth.expiresAt,
  };
}

/**
 * Convert Pi Network payment to our app's Transaction format
 */
function convertPiPaymentToTransaction(piPayment: PiPayment): Transaction {
  return {
    id: piPayment.identifier,
    type: piPayment.amount > 0 ? 'received' : 'sent',
    amount: Math.abs(piPayment.amount),
    status: piPayment.status === 'completed' ? 'completed' : 
            piPayment.status === 'pending' ? 'pending' : 'failed',
    from: piPayment.user_uid,
    to: piPayment.to_address || 'Network',
    description: piPayment.memo,
    date: piPayment.created_at,
    blockExplorerUrl: piPayment.transaction?._link || '#',
  };
}

/**
 * Authenticate user with Pi Network (Official SDK 2.0)
 * In a real app, this would make the actual Pi SDK call
 * For development, it falls back to mock data
 */
export async function getAuthenticatedUser(): Promise<User> {
  console.log("Attempting to authenticate with Pi Network...");

  if (isPiBrowser()) {
    try {
      const piSDK = getPiSDK();
      const authResult = await piSDK.authenticate(['username', 'payments'], handleIncompletePayment);
      return convertPiUserToAppUser(authResult.user, authResult);
    } catch (error) {
      console.error("Pi Network authentication failed, falling back to mock data:", error);
      return mockApiCall({ data: mockUser });
    }
  } else {
    console.log("Not in Pi Browser, using mock data");
    return mockApiCall({ data: mockUser });
  }
}

/**
 * Create a Pi Network payment
 * @param paymentData - Payment details
 * @param callbacks - Payment callbacks
 * @returns Promise<PiPayment>
 */
export async function createPiPayment(
  paymentData: PiPaymentData,
  callbacks: PaymentCallbacks
): Promise<PiPayment> {
  // Check if we're in Pi Browser environment AND not in sandbox mode
  if (!isPiBrowser() || isSandboxMode()) {
    console.log('Not in Pi Browser or in sandbox mode - using mock payment flow');
    
    // Create mock payment for development
    const mockPayment: PiPayment = {
      identifier: `mock_${Date.now()}`,
      user_uid: 'mock_user',
      amount: paymentData.amount,
      memo: paymentData.memo,
      metadata: paymentData.metadata || {},
      to_address: paymentData.to_address || 'mock_address',
      created_at: new Date().toISOString(),
      status: 'pending',
      transaction: null,
    };

    // Simulate payment flow with delays
    setTimeout(() => {
      callbacks.onReadyForServerApproval(mockPayment.identifier);
    }, 1000);

    setTimeout(() => {
      const txid = `mock_tx_${Date.now()}`;
      mockPayment.status = 'completed';
      mockPayment.transaction = {
        txid,
        verified: true,
        _link: `https://explorer.minepi.com/tx/${txid}`,
      };
      callbacks.onReadyForServerCompletion(mockPayment.identifier, txid);
    }, 3000);

    return mockPayment;
  }

  try {
    const sdk = getPiSDK();
    
    // Create payment using Pi Network SDK
    const payment = await sdk.createPayment(paymentData, {
      onReadyForServerApproval: (paymentId: string) => {
        console.log('Payment ready for server approval:', paymentId);
        
        // Track payment status
        activePayments.set(paymentId, {
          paymentId,
          status: 'pending',
          amount: paymentData.amount,
          memo: paymentData.memo,
          createdAt: new Date().toISOString(),
        });
        
        callbacks.onReadyForServerApproval(paymentId);
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log('Payment ready for server completion:', paymentId, txid);
        
        // Update payment status
        const paymentStatus = activePayments.get(paymentId);
        if (paymentStatus) {
          paymentStatus.status = 'approved';
          paymentStatus.txid = txid;
        }
        
        callbacks.onReadyForServerCompletion(paymentId, txid);
      },
      onCancel: (paymentId: string) => {
        console.log('Payment cancelled:', paymentId);
        
        // Update payment status
        const paymentStatus = activePayments.get(paymentId);
        if (paymentStatus) {
          paymentStatus.status = 'cancelled';
        }
        
        callbacks.onCancel(paymentId);
      },
      onError: (error: Error, payment: PiPayment) => {
        console.error('Payment error:', error, payment);
        
        // Update payment status
        const paymentStatus = activePayments.get(payment.identifier);
        if (paymentStatus) {
          paymentStatus.status = 'failed';
        }
        
        callbacks.onError(error, payment);
      },
    });
    
    return payment;
  } catch (error) {
    console.error('Failed to create Pi payment:', error);
    throw new Error(`Payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Complete a Pi Network payment
 * @param payment - Payment object from createPayment
 * @returns Promise<PiPayment>
 */
export async function completePiPayment(payment: PiPayment): Promise<PiPayment> {
  // Check if we're in Pi Browser environment
  if (!isPiBrowser()) {
    console.log('Not in Pi Browser - using mock payment completion');
    
    // Return mock completed payment
    const completedPayment = { ...payment };
    completedPayment.status = 'completed';
    
    // Update payment status
    const paymentStatus = activePayments.get(payment.identifier);
    if (paymentStatus) {
      paymentStatus.status = 'completed';
      paymentStatus.completedAt = new Date().toISOString();
    }
    
    return completedPayment;
  }

  try {
    const sdk = getPiSDK();
    
    // Complete payment using Pi Network SDK
    const completedPayment = await sdk.completePayment(payment);
    
    // Update payment status
    const paymentStatus = activePayments.get(payment.identifier);
    if (paymentStatus) {
      paymentStatus.status = 'completed';
      paymentStatus.completedAt = new Date().toISOString();
    }
    
    return completedPayment;
  } catch (error) {
    console.error('Failed to complete Pi payment:', error);
    throw new Error(`Payment completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Cancel a Pi Network payment
 * @param payment - Payment object to cancel
 * @returns Promise<PiPayment>
 */
export async function cancelPiPayment(payment: PiPayment): Promise<PiPayment> {
  // Check if we're in Pi Browser environment
  if (!isPiBrowser()) {
    console.log('Not in Pi Browser - using mock payment cancellation');
    
    // Return mock cancelled payment
    const cancelledPayment = { ...payment };
    cancelledPayment.status = 'cancelled';
    
    // Update payment status
    const paymentStatus = activePayments.get(payment.identifier);
    if (paymentStatus) {
      paymentStatus.status = 'cancelled';
    }
    
    return cancelledPayment;
  }

  try {
    const sdk = getPiSDK();
    
    // Cancel payment using Pi Network SDK
    const cancelledPayment = await sdk.cancelPayment(payment);
    
    // Update payment status
    const paymentStatus = activePayments.get(payment.identifier);
    if (paymentStatus) {
      paymentStatus.status = 'cancelled';
    }
    
    return cancelledPayment;
  } catch (error) {
    console.error('Failed to cancel Pi payment:', error);
    throw new Error(`Payment cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get payment status
 * @param paymentId - Payment identifier
 * @returns PaymentStatus | null
 */
export function getPaymentStatus(paymentId: string): PaymentStatus | null {
  return activePayments.get(paymentId) || null;
}

/**
 * Get all active payments
 * @returns PaymentStatus[]
 */
export function getActivePayments(): PaymentStatus[] {
  return Array.from(activePayments.values());
}

/**
 * Create a donation payment
 * @param amount - Donation amount in Pi
 * @param message - Optional donation message
 * @param callbacks - Payment callbacks
 * @returns Promise<PiPayment>
 */
export async function createDonationPayment(
  amount: number,
  message?: string,
  callbacks?: Partial<PaymentCallbacks>
): Promise<PiPayment> {
  const defaultCallbacks: PaymentCallbacks = {
    onReadyForServerApproval: (paymentId: string) => {
      console.log('Donation ready for approval:', paymentId);
    },
    onReadyForServerCompletion: (paymentId: string, txid: string) => {
      console.log('Donation ready for completion:', paymentId, txid);
    },
    onCancel: (paymentId: string) => {
      console.log('Donation cancelled:', paymentId);
    },
    onError: (error: Error, payment: PiPayment) => {
      console.error('Donation error:', error, payment);
    },
  };

  const paymentData: PiPaymentData = {
    amount,
    memo: message || `Support Dynamic Wallet View - ${amount}π donation`,
    metadata: {
      type: 'donation',
      app: 'dynamic-wallet-view',
      timestamp: new Date().toISOString(),
    },
  };

  return createPiPayment(paymentData, { ...defaultCallbacks, ...callbacks });
}

/**
 * Get user's Pi balance from Pi Network
 */
export async function getUserPiBalance(accessToken: string): Promise<number> {
  if (isPiBrowser()) {
    try {
      const piAPI = getPiAPI();
      const balance = await piAPI.getUserBalance(accessToken);
      console.log("Pi Network balance fetched:", balance);
      return balance;
    } catch (error) {
      console.error("Pi Network balance fetch failed:", error);
      return 0;
    }
  } else {
    // Mock balance for development
    console.log("Mock balance fetch for development");
    return mockApiCall({ data: 150.5 });
  }
}

/**
 * Get user's payment history from Pi Network
 */
export async function getUserPaymentHistory(accessToken: string): Promise<Transaction[]> {
  if (isPiBrowser()) {
    try {
      const piAPI = getPiAPI();
      const payments = await piAPI.getPaymentHistory(accessToken);
      console.log("Pi Network payment history fetched:", payments);
      
      // Convert Pi payments to our app's transaction format
      return payments.map(convertPiPaymentToTransaction);
    } catch (error) {
      console.error("Pi Network payment history fetch failed:", error);
      return [];
    }
  } else {
    // Mock payment history for development
    console.log("Mock payment history fetch for development");
    return mockApiCall({ data: mockTransactions });
  }
}

/**
 * Validate Pi Network access token
 */
export async function validatePiToken(accessToken: string): Promise<boolean> {
  if (isPiBrowser()) {
    try {
      const piAPI = getPiAPI();
      const isValid = await piAPI.validateToken(accessToken);
      console.log("Pi Network token validation result:", isValid);
      return isValid;
    } catch (error) {
      console.error("Pi Network token validation failed:", error);
      return false;
    }
  } else {
    // Mock token validation for development
    console.log("Mock token validation for development");
    return mockApiCall({ data: true });
  }
}

/**
 * Get team members from API
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const response = await fetch('/api/team/members', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch team members:', response.status);
      return mockTeam; // Fallback to mock data
    }

    const data = await response.json();
    return data.members || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return mockTeam; // Fallback to mock data
  }
}

/**
 * Get node data from API
 */
export async function getNodeData(): Promise<NodeData> {
  try {
    const response = await fetch('/api/node/performance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch node data:', response.status);
      return mockNodeData; // Fallback to mock data
    }

    const data = await response.json();
    return data.nodeData;
  } catch (error) {
    console.error('Error fetching node data:', error);
    return mockNodeData; // Fallback to mock data
  }
}

/**
 * Get transactions from API
 */
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch('/api/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch transactions:', response.status);
      return mockTransactions; // Fallback to mock data
    }

    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return mockTransactions; // Fallback to mock data
  }
}

/**
 * Get notifications from API
 */
export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch notifications:', response.status);
      return mockNotifications; // Fallback to mock data
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return mockNotifications; // Fallback to mock data
  }
}

/**
 * Send broadcast notification
 */
export async function sendBroadcastNotification(message: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
      body: JSON.stringify({
        type: 'team_message',
        title: 'Message from your Team Leader',
        description: message,
        link: '/dashboard/team',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send broadcast notification:', response.status);
      return { success: false };
    }

    const data = await response.json();
    return { success: data.success };
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    return { success: false };
  }
}

/**
 * Add transaction (mock implementation)
 */
export async function addTransaction(transaction: Omit<Transaction, 'id' | 'date' | 'blockExplorerUrl'>): Promise<Transaction> {
  const newTransaction: Transaction = {
    ...transaction,
    id: `tx_${Date.now()}`,
    date: new Date().toISOString(),
    blockExplorerUrl: '#',
  };
  
  console.log("Mock transaction added:", newTransaction);
  return mockApiCall({ data: newTransaction });
}

/**
 * Add notification via API
 */
export async function addNotification(notification: Omit<Notification, 'id' | 'date' | 'read'>): Promise<Notification> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      console.error('Failed to add notification:', response.status);
      // Fallback to mock notification
      const mockNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}`,
        date: new Date().toISOString(),
        read: false,
      };
      return mockNotification;
    }

    const data = await response.json();
    return data.notification;
  } catch (error) {
    console.error('Error adding notification:', error);
    // Fallback to mock notification
    const mockNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    };
    return mockNotification;
  }
}

/**
 * Mark notification as read via API
 */
export async function markNotificationAsRead(notificationId: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
      body: JSON.stringify({
        action: 'markAsRead',
        notificationId: notificationId,
      }),
    });

    if (!response.ok) {
      console.error('Failed to mark notification as read:', response.status);
      return { success: false };
    }

    const data = await response.json();
    return { success: data.success };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false };
  }
}

/**
 * Mark all notifications as read via API
 */
export async function markAllNotificationsAsRead(): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
      body: JSON.stringify({
        action: 'markAllAsRead',
      }),
    });

    if (!response.ok) {
      console.error('Failed to mark all notifications as read:', response.status);
      return { success: false };
    }

    const data = await response.json();
    return { success: data.success };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false };
  }
}

/**
 * Get team activity summary from API
 */
export async function getTeamActivitySummary(): Promise<any> {
  try {
    const response = await fetch('/api/team/activity-summary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch team activity summary:', response.status);
      return { topMembers: [], userRank: 1, recentBadges: [] }; // Fallback
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching team activity summary:', error);
    return { topMembers: [], userRank: 1, recentBadges: [] }; // Fallback
  }
}

/**
 * Calculate mining rate via API
 */
export async function calculateMiningRate(lockupPercentage: number, lockupDuration: number, currentMiningRate?: number): Promise<any> {
  try {
    const response = await fetch('/api/calculator/mining-rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
      body: JSON.stringify({
        lockupPercentage,
        lockupDuration,
        currentMiningRate,
      }),
    });

    if (!response.ok) {
      console.error('Failed to calculate mining rate:', response.status);
      return { calculation: { totalMiningRate: 0.1 } }; // Fallback
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calculating mining rate:', error);
    return { calculation: { totalMiningRate: 0.1 } }; // Fallback
  }
}

/**
 * Update user settings via API
 */
export async function updateUserSettings(settings: any): Promise<any> {
  try {
    const response = await fetch('/api/user/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      console.error('Failed to update user settings:', response.status);
      return { success: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    return { success: false };
  }
}

/**
 * Get user settings via API
 */
export async function getUserSettings(): Promise<any> {
  try {
    const response = await fetch('/api/user/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('dynamic-wallet-user') ? JSON.parse(localStorage.getItem('dynamic-wallet-user') || '{}').accessToken || 'mock-token' : 'mock-token' : 'mock-token'}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user settings:', response.status);
      return { user: { name: 'User', bio: '', settings: { remindersEnabled: true, reminderHoursBefore: 2 } } }; // Fallback
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return { user: { name: 'User', bio: '', settings: { remindersEnabled: true, reminderHoursBefore: 2 } } }; // Fallback
  }
}

/**
 * Submit feedback (mock implementation)
 */
export async function submitFeedback(feedback: string): Promise<{ success: boolean }> {
  console.log("Mock feedback submitted:", feedback);
  return mockApiCall({ data: { success: true } });
}

/**
 * Simulate KYC completion (mock implementation)
 */
export async function simulateKycCompletion(teamMemberId: string): Promise<{ success: boolean }> {
  console.log("Mock KYC completion for team member:", teamMemberId);
  return mockApiCall({ data: { success: true } });
}
