
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
  userActiveMiningHours_LastWeek?: number;
  userActiveMiningHours_LastMonth?: number;
  activeMiningDays_LastWeek?: number;
  weeklyMiningDaysTarget?: number;
  activeMiningDays_LastMonth?: number;
  monthlyMiningDaysTarget?: number;
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
  transferable: number;
  unverified: number;
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
