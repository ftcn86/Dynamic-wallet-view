import { NextRequest, NextResponse } from 'next/server';
import { getUserPiBalance, getTeamMembers, getNodeData, getTransactions } from '@/services/piService';
import type { User } from '@/data/schemas';

/**
 * User Data API Endpoint
 * 
 * This endpoint returns comprehensive user information including:
 * - Basic profile data
 * - Pi balance and mining information
 * - Team data
 * - Node status (if applicable)
 * - Transaction history
 * - Activity metrics
 */

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Validate the session token from headers
    // 2. Get user ID from the session
    // 3. Fetch user data from database
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    
    // Mock user ID for development
    const userId = 'mock_user_id';
    
    // Fetch all user data
    const [balance, teamMembers, nodeData, transactions] = await Promise.all([
      getUserPiBalance(sessionToken),
      getTeamMembers(),
      getNodeData(),
      getTransactions(),
    ]);

    // Calculate activity metrics
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Mock activity calculations (in real app, this would come from database)
    const userActiveMiningHours_LastWeek = Math.floor(Math.random() * 24) + 1;
    const userActiveMiningHours_LastMonth = Math.floor(Math.random() * 168) + 24;
    const activeMiningDays_LastWeek = Math.floor(Math.random() * 7) + 1;
    const activeMiningDays_LastMonth = Math.floor(Math.random() * 30) + 7;

    // Construct comprehensive user object
    const userData: User = {
      id: userId,
      username: 'mock_username',
      name: 'Mock Pi User',
      email: 'mock@example.com',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mock_user',
      bio: 'Pi Network Pioneer - Active miner and community member',
      totalBalance: balance,
      miningRate: 0.0202, // Base rate + bonuses would be calculated
      isNodeOperator: nodeData.status !== 'offline',
      nodeUptimePercentage: nodeData.uptimePercentage,
      balanceBreakdown: {
        transferableToMainnet: balance * 0.7, // Mock calculation
        totalUnverifiedPi: balance * 0.3,
        currentlyInLockups: 0,
      },
      unverifiedPiDetails: {
        fromReferralTeam: balance * 0.15,
        fromSecurityCircle: balance * 0.1,
        fromNodeRewards: balance * 0.03,
        fromOtherBonuses: balance * 0.02,
      },
      badges: [
        {
          id: 'first_mining_session',
          name: 'First Mining Session',
          description: 'Completed your first mining session',
          iconUrl: '/badges/first-mining.svg',
          earned: true,
          earnedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'team_builder',
          name: 'Team Builder',
          description: 'Successfully invited team members',
          iconUrl: '/badges/team-builder.svg',
          earned: teamMembers.length > 0,
          earnedDate: teamMembers.length > 0 ? new Date().toISOString() : undefined,
        },
      ],
      userActiveMiningHours_LastWeek,
      userActiveMiningHours_LastMonth,
      activeMiningDays_LastWeek,
      activeMiningDays_LastMonth,
      termsAccepted: true,
      settings: {
        remindersEnabled: true,
        reminderHoursBefore: 1,
      },
    };

    return NextResponse.json({
      success: true,
      user: userData,
      // Additional data that might be useful
      teamMembers,
      nodeData,
      recentTransactions: transactions.slice(0, 10), // Last 10 transactions
      activityMetrics: {
        userActiveMiningHours_LastWeek,
        userActiveMiningHours_LastMonth,
        activeMiningDays_LastWeek,
        activeMiningDays_LastMonth,
      },
    });
  } catch (error) {
    console.error('User data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

/**
 * Update user settings
 */
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const { settings } = await request.json();

    // In a real app, you would:
    // 1. Validate the session token
    // 2. Update user settings in database
    // 3. Return updated user data

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 