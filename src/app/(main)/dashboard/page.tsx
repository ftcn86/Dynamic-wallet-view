
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { AnalysisCard } from '@/components/dashboard/AnalysisCard';
import { mockTeam } from '@/data/mocks';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Solid SVG Icons
const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary-foreground))" {...props}>
        <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2-2H4a2 2 0 0 1-2-2v-2" />
        <path d="M4 14v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
        <path d="M18 12a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4z" />
        <circle cx="16" cy="14" r="1" fill="hsl(var(--primary))" />
    </svg>
);

const GaugeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0" fill="hsl(var(--primary-foreground))"/>
        <path d="m12 12-4 2" stroke="hsl(var(--primary))" />
        <path d="M12 14v4" stroke="hsl(var(--primary))" />
        <path d="M16 12-2 3" stroke="hsl(var(--primary))" />
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary-foreground))" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary-foreground))" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="hsl(var(--primary))" strokeWidth="2"/>
    </svg>
);

const PieChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M21.21 15.89A10 10 0 1 1 8.11 2.79" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);

const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M3 3v18h18" stroke="#fff" strokeWidth="2" fill="none" />
        <path d="M7 12h4v6H7zm6-4h4v10h-4z" />
    </svg>
);

const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M4 22h16" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M10 14.66V22h4v-7.34" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M12 15c-3.87 0-7-3.13-7-7V4h14v4c0 3.87-3.13 7-7 7z" />
    </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3" fill="#fff" />
    </svg>
);


const TABS = ['overview', 'portfolio', 'achievements', 'analysis'];

export default function DashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(TABS.includes(initialTab as string) ? initialTab : 'overview');


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
              title="Node Uptime"
              value={`${user.nodeUptimePercentage.toFixed(1)}%`}
              icon={<ServerIcon />}
              footerValue="Uptime last 90d"
              badgeText="Online"
              badgeVariant="success"
            />
          </Link>
        )}
      </div>

      <Tabs value={activeTab as string} onValueChange={setActiveTab} className="w-full">
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
          <AnalysisCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
