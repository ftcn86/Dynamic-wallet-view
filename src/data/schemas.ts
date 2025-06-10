
export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  totalBalance: number;
  miningRate: number;
  isNodeOperator: boolean;
  balanceBreakdown: {
    transferableToMainnet: number;
    fromYourTeamUnverified: number;
    currentlyInLockups: number;
  };
  badges: Badge[];
  weeklyMiningProgress?: number;
  weeklyMiningTarget?: number;
  monthlyMiningProgress?: number;
  monthlyMiningTarget?: number;
  // New fields for gamification
  userActiveMiningHours_LastWeek?: number;
  userActiveMiningHours_LastMonth?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string; // URL to the badge image
  earned: boolean;
  earnedDate?: string; // ISO date string
  dataAiHint?: string;
}

export type KycStatus = 'completed' | 'pending' | 'not_completed';

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  joinDate: string; // ISO date string
  status: 'active' | 'inactive' | 'pending';
  unverifiedPiContribution: number;
  // New fields for gamification
  teamMemberActiveMiningHours_LastWeek?: number;
  teamMemberActiveMiningHours_LastMonth?: number;
  kycStatus?: KycStatus; // Added KYC status
}

export interface NodeData {
  nodeId: string;
  uptimePercentage: number; // e.g., 99.95
  performanceScore: number; // e.g., 850 (out of 1000)
  performanceHistory: Array<{ date: string; score: number }>; // For chart
}

// For Balance Fluctuation Chart
export interface BalanceChartDataPoint {
  date: string; // e.g., "2023-01-01"
  balance: number;
}

export interface MockChartData {
  '3M': BalanceChartDataPoint[];
  '6M': BalanceChartDataPoint[];
  '12M': BalanceChartDataPoint[];
}

export interface LegalSection {
  title: string;
  content: string;
}
