import type { User, TeamMember, NodeData, MockChartData, Badge } from './schemas';

export const mockUser: User = {
  id: 'user123',
  username: 'pioneer1',
  name: 'Alex Pioneer',
  avatarUrl: 'https://placehold.co/100x100.png',
  bio: 'Passionate Pi Network enthusiast and node operator. Exploring the future of digital currency.',
  totalBalance: 12345.6789,
  miningRate: 0.2512,
  isNodeOperator: true,
  balanceBreakdown: {
    transferableToMainnet: 5678.1234,
    fromYourTeamUnverified: 3456.7890,
    currentlyInLockups: 3210.7665,
  },
  badges: [
    { id: 'b001', name: 'Early Adopter', description: 'Joined Pi Network in its early stages.', iconUrl: 'https://placehold.co/128x128/5865F2/FFFFFF.png?text=E', earned: true, earnedDate: '2020-05-15T10:00:00Z', dataAiHint: "award medal" },
    { id: 'b002', name: 'Node Runner', description: 'Successfully operates a Pi Node.', iconUrl: 'https://placehold.co/128x128/34D399/FFFFFF.png?text=N', earned: true, earnedDate: '2021-11-01T10:00:00Z', dataAiHint: "server computer" },
    { id: 'b003', name: 'Team Builder', description: 'Invited 10+ active members to their team.', iconUrl: 'https://placehold.co/128x128/F59E0B/FFFFFF.png?text=T', earned: false, dataAiHint: "team people" },
    { id: 'b004', name: 'KYC Verified', description: 'Successfully completed KYC verification.', iconUrl: 'https://placehold.co/128x128/10B981/FFFFFF.png?text=V', earned: true, earnedDate: '2022-01-20T10:00:00Z', dataAiHint: "verified checkmark" },
  ],
};

export const mockTeam: TeamMember[] = [
  { id: 'team001', name: 'Bob Miner', avatarUrl: 'https://placehold.co/40x40.png', joinDate: '2022-03-10T10:00:00Z', status: 'active', unverifiedPiContribution: 120.5 },
  { id: 'team002', name: 'Charlie User', avatarUrl: 'https://placehold.co/40x40.png', joinDate: '2022-08-20T10:00:00Z', status: 'inactive', unverifiedPiContribution: 55.0 },
  { id: 'team003', name: 'Diana Node', avatarUrl: 'https://placehold.co/40x40.png', joinDate: '2023-01-05T10:00:00Z', status: 'pending', unverifiedPiContribution: 0 },
  { id: 'team004', name: 'Edward Pi', avatarUrl: 'https://placehold.co/40x40.png', joinDate: '2021-12-15T10:00:00Z', status: 'active', unverifiedPiContribution: 250.75 },
];

export const mockNodeData: NodeData = {
  nodeId: 'nodeXYZ789',
  uptimePercentage: 99.85,
  performanceScore: 920,
  performanceHistory: [
    { date: '2024-03-01', score: 880 },
    { date: '2024-04-01', score: 900 },
    { date: '2024-05-01', score: 910 },
    { date: '2024-06-01', score: 920 },
  ],
};

export const mockChartData: MockChartData = {
  '3M': [
    { date: '2024-04-01', balance: 12000 },
    { date: '2024-05-01', balance: 12150 },
    { date: '2024-06-01', balance: 12345 },
  ],
  '6M': [
    { date: '2024-01-01', balance: 11500 },
    { date: '2024-02-01', balance: 11600 },
    { date: '2024-03-01', balance: 11800 },
    { date: '2024-04-01', balance: 12000 },
    { date: '2024-05-01', balance: 12150 },
    { date: '2024-06-01', balance: 12345 },
  ],
  '12M': [
    { date: '2023-07-01', balance: 10000 },
    { date: '2023-08-01', balance: 10200 },
    { date: '2023-09-01', balance: 10500 },
    { date: '2023-10-01', balance: 10800 },
    { date: '2023-11-01', balance: 11000 },
    { date: '2023-12-01', balance: 11200 },
    { date: '2024-01-01', balance: 11500 },
    { date: '2024-02-01', balance: 11600 },
    { date: '2024-03-01', balance: 11800 },
    { date: '2024-04-01', balance: 12000 },
    { date: '2024-05-01', balance: 12150 },
    { date: '2024-06-01', balance: 12345 },
  ],
};
