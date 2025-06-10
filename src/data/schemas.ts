
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
    totalUnverifiedPi: number;
    currentlyInLockups: number;
  };
  unverifiedPiDetails: {
    fromReferralTeam: number;
    fromSecurityCircle: number;
    fromNodeRewards: number;
    fromOtherBonuses: number;
  };
  badges: Badge[];
  userActiveMiningHours_LastWeek?: number; // Kept for other potential uses (e.g. team activity card)
  userActiveMiningHours_LastMonth?: number; // Kept for other potential uses
  activeMiningDays_LastWeek?: number; // New: Tracks active mining days in the last week
  weeklyMiningDaysTarget?: number; // New: Target for active mining days in a week
  activeMiningDays_LastMonth?: number; // New: Tracks active mining days in the last month
  monthlyMiningDaysTarget?: number; // New: Target for active mining days in a month
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earned: boolean;
  earnedDate?: string;
  dataAiHint?: string;
}

export type KycStatus = 'completed' | 'pending' | 'not_completed';

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  unverifiedPiContribution: number;
  teamMemberActiveMiningHours_LastWeek?: number;
  teamMemberActiveMiningHours_LastMonth?: number;
  kycStatus?: KycStatus;
}

export interface NodeData {
  nodeId: string;
  uptimePercentage: number;
  performanceScore: number;
  performanceHistory: Array<{ date: string; score: number }>;
}

export interface BalanceChartDataPoint {
  date: string;
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
