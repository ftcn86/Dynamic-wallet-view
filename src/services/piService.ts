
"use client";

import { mockApiCall } from '@/lib/api';
import { mockUser, mockTeam, mockNodeData, mockTransactions, mockNotifications } from '@/data/mocks';
import type { User, TeamMember, NodeData, Transaction, Notification } from '@/data/schemas';

// --- SERVICE WRAPPER ---
// This service layer abstracts the data source.
// It checks if the Pi SDK is available and would use it in a real app.
// For our prototype, it provides a clear structure and falls back to mock data.

/**
 * Checks if the code is running within the Pi Browser.
 * In a real app, this would be more robust.
 */
const isPiBrowser = (): boolean => {
  // For the prototype, we can assume if window.Pi is available, we're in the right environment.
  return typeof window !== 'undefined' && !!(window as any).Pi;
};

/**
 * A mock representation of the Pi SDK User object after authentication.
 */
interface PiAuthData {
  uid: string;
  username: string;
  accessToken: string;
}

/**
 * Simulates authenticating with the Pi Network SDK.
 * In a real app, this would make the `window.Pi.authenticate` call.
 * For the prototype, it immediately resolves with mock user data to continue the flow.
 */
export async function getAuthenticatedUser(): Promise<User> {
  console.log("Attempting to authenticate...");
  if (isPiBrowser()) {
    // REAL SCENARIO: This is where you would call the actual Pi SDK
    // const scopes = ['username'];
    // const authResult = await (window as any).Pi.authenticate(scopes, onIncompletePaymentFound);
    // const piUser: PiAuthData = authResult.user;
    //
    // Then you would fetch your app's user profile from your own backend using the accessToken.
    // For now, we'll return the mock user to simulate a successful login.
    console.log("Pi Browser environment detected. Simulating real auth by returning mock user.");
    return mockApiCall({ data: mockUser });
  } else {
    // MOCK SCENARIO: Running in a regular browser
    console.log("Not in Pi Browser. Returning mock user for development.");
    return mockApiCall({ data: mockUser });
  }
}

/**
 * Fetches the team members.
 * In a real app, this would be an authenticated API call to your backend.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isPiBrowser()) {
    // REAL SCENARIO: Fetch from your backend API
    console.log("Pi Browser: Simulating fetch for team members.");
    return mockApiCall({ data: mockTeam });
  } else {
    // MOCK SCENARIO:
    console.log("Dev Browser: Returning mock team members.");
    return mockApiCall({ data: mockTeam });
  }
}

/**
 * Fetches the node data for the current user.
 * In a real app, this would be an authenticated API call to your backend.
 */
export async function getNodeData(): Promise<NodeData> {
  if (isPiBrowser()) {
    // REAL SCENARIO: Fetch from your backend API
    console.log("Pi Browser: Simulating fetch for node data.");
    return mockApiCall({ data: mockNodeData });
  } else {
    // MOCK SCENARIO:
    console.log("Dev Browser: Returning mock node data.");
    return mockApiCall({ data: mockNodeData });
  }
}

/**
 * Fetches the transaction history for the current user.
 * In a real app, this would be an authenticated API call to your backend.
 */
export async function getTransactions(): Promise<Transaction[]> {
    if (isPiBrowser()) {
        console.log("Pi Browser: Simulating fetch for transactions.");
        return mockApiCall({ data: mockTransactions });
    } else {
        console.log("Dev Browser: Returning mock transactions.");
        return mockApiCall({ data: mockTransactions });
    }
}

/**
 * Fetches notifications for the current user.
 */
export async function getNotifications(): Promise<Notification[]> {
    if (isPiBrowser()) {
        console.log("Pi Browser: Simulating fetch for notifications.");
        return mockApiCall({ data: mockNotifications });
    } else {
        console.log("Dev Browser: Returning mock notifications.");
        return mockApiCall({ data: mockNotifications });
    }
}
