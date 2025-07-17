
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/shared/KPICard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PI_APP_MINING_URL } from '@/lib/constants';
import { BalanceBreakdownCard } from '@/components/dashboard/BalanceBreakdownCard';
import { UnverifiedPiDetailCard } from '@/components/dashboard/UnverifiedPiDetailCard';
import { MiningFocusCard } from '@/components/dashboard/MiningFocusCard';
import { TeamActivityCard } from '@/components/dashboard/TeamActivityCard';
import { BalanceFluctuationChartCard } from '@/components/dashboard/BalanceFluctuationChartCard';
import { MyBadgesCard } from '@/components/dashboard/MyBadgesCard';
import { LockupCalculatorCard } from '@/components/dashboard/LockupCalculatorCard';
import { AIFeatureFeedbackCard } from '@/components/dashboard/AIFeatureFeedbackCard';
import { mockTeam } from '@/data/mocks';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
    WalletIcon, 
    GaugeIconDashboard as GaugeIcon, 
    UsersIcon, 
    ServerIcon, 
    PieChartIcon, 
    BarChartIcon, 
    TrophyIcon, 
    SettingsIcon 
} from '@/components/shared/icons';

const TABS = ['overview', 'portfolio', 'achievements', 'analysis'];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(TABS.includes(initialTab as string) ? initialTab : 'overview');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard?tab=${value}`, { scroll: false });
  };

  const handleRedirectToPiApp = () => {
    window.open(PI_APP_MINING_URL, '_blank');
  };

  if (!user) {
    return ( 
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  const activeTeamMembers = mockTeam.filter(m => m.status === 'active').length;
  const totalTeamMembers = mockTeam.length;

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <KPICard
          title="Total Pi Balance"
          value={user.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4}) + ' π'}
          icon={<WalletIcon />}
          footerValue={`~$${(user.totalBalance * 0.042).toFixed(2)} USD`}
          change="+2.3%"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer">
              <KPICard
                title="Current Mining Rate"
                value={`${user.miningRate.toFixed(4)} π/hr`}
                icon={<GaugeIcon />}
                footerValue="Next session in 12h"
                badgeText="Active"
                badgeVariant="success"
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Redirect to Pi App?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be redirected to the Pi Network app to manage your mining session. Continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRedirectToPiApp}>
                Continue to Pi App
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Link href="/dashboard/team" className="block">
          <KPICard
            title="Active Team Members"
            value={`${activeTeamMembers} / ${totalTeamMembers}`}
            icon={<UsersIcon />}
            footerValue={`${totalTeamMembers - activeTeamMembers} inactive`}
          />
        </Link>
        
        {user.isNodeOperator && user.nodeUptimePercentage !== undefined && (
          <Link href="/dashboard/node" className="block">
            <KPICard
              title="Node Uptime (90d)"
              value={`${user.nodeUptimePercentage.toFixed(1)}%`}
              icon={<ServerIcon />}
              footerValue="Uptime last 90d"
              badgeText="Online"
              badgeVariant="success"
            />
          </Link>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="min-w-0 flex-nowrap w-auto sm:w-full sm:grid sm:grid-cols-4 max-w-2xl">
              <TabsTrigger value="overview"><PieChartIcon className="mr-2 h-4 w-4" />Overview</TabsTrigger>
              <TabsTrigger value="portfolio"><BarChartIcon className="mr-2 h-4 w-4" />Portfolio</TabsTrigger>
              <TabsTrigger value="achievements"><TrophyIcon className="mr-2 h-4 w-4" />Achievements</TabsTrigger>
              <TabsTrigger value="analysis"><SettingsIcon className="mr-2 h-4 w-4" />Analysis</TabsTrigger>
            </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="overview" className="mt-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BalanceBreakdownCard />
                <TeamActivityCard />
              </div>
              <div className="space-y-6">
                <UnverifiedPiDetailCard />
                <MiningFocusCard />
              </div>
            </div>
        </TabsContent>
        <TabsContent value="portfolio" className="mt-6">
          <BalanceFluctuationChartCard />
        </TabsContent>
        <TabsContent value="achievements" className="mt-6">
          <MyBadgesCard />
        </TabsContent>
        <TabsContent value="analysis" className="mt-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <LockupCalculatorCard />
              <AIFeatureFeedbackCard />
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
