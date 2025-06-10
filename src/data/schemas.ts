
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
    totalUnverifiedPi: number; // Renamed from fromYourTeamUnverified
    currentlyInLockups: number;
  };
  unverifiedPiDetails: { // New field for detailed breakdown
    fromReferralTeam: number;
    fromSecurityCircle: number;
    fromOtherBonuses: number;
  };
  badges: Badge[];
  weeklyMiningProgress?: number;
  weeklyMiningTarget?: number;
  monthlyMiningProgress?: number;
  monthlyMiningTarget?: number;
  userActiveMiningHours_LastWeek?: number;
  userActiveMiningHours_LastMonth?: number;
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
