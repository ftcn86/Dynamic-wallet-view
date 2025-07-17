
"use client"

import Link from 'next/link';
import { Banknote, Gauge, Users as UsersIcon, Server } from 'lucide-react';
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
import { PI_APP_MINING_URL } from '@/lib/constants';
import { BalanceBreakdownCard } from '@/components/dashboard/BalanceBreakdownCard';
import { UnverifiedPiDetailCard } from '@/components/dashboard/UnverifiedPiDetailCard';
import { MiningFocusCard } from '@/components/dashboard/MiningFocusCard';
import { TeamActivityCard } from '@/components/dashboard/TeamActivityCard';
import { mockTeam } from '@/data/mocks';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();

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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Pi Balance"
          value={user.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4}) + ' π'}
          icon={<Banknote />}
          footerValue={`~$${(user.totalBalance * 0.042).toFixed(2)} USD`}
          change="+2.3%"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer">
              <KPICard
                title="Current Mining Rate"
                value={`${user.miningRate.toFixed(4)} π/hr`}
                icon={<Gauge />}
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
              icon={<Server />}
              footerValue="Uptime last 30d"
              badgeText="Online"
              badgeVariant="success"
            />
          </Link>
        )}
      </div>

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
    </div>
  );
}
