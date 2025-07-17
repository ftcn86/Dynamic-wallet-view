
"use client"

import Link from 'next/link';
import { Banknote, Gauge, Users as UsersIcon, Server, CalendarIcon, ArrowUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { mockTeam, mockChartData } from '@/data/mocks'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';
import type { Badge } from '@/data/schemas';
import type { ChartConfig } from '@/components/ui/chart';
import { PI_APP_MINING_URL } from '@/lib/constants';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { MiningFocusCard } from '@/components/dashboard/MiningFocusCard';
import { TeamActivityCard } from '@/components/dashboard/TeamActivityCard';
import { UnverifiedPiDetailCard } from '@/components/dashboard/UnverifiedPiDetailCard';
import * as RechartsPrimitive from "recharts";
import { cn } from '@/lib/utils';


function BadgeDetailsDialog({ badge, children }: { badge: Badge, children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image src={badge.iconUrl} alt={badge.name} width={96} height={96} className="rounded-lg" data-ai-hint={badge.dataAiHint || 'badge icon'} />
          </div>
          <DialogTitle className="text-center text-xl font-headline">{badge.name}</DialogTitle>
          <DialogDescription className="text-center">
            {badge.description}
          </DialogDescription>
        </DialogHeader>
        {badge.earned && badge.earnedDate && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Earned on: {format(new Date(badge.earnedDate), 'MMMM d, yyyy')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


function MyBadges() {
  const { user } = useAuth();

  if (!user || !user.badges) return null;
  
  const earnedBadgesCount = user.badges.filter(b => b.earned).length;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
           <CardTitle className="font-headline text-xl">Achievements</CardTitle>
           <span className="text-sm font-medium text-primary">{earnedBadgesCount} Earned</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.badges.map((badge) => (
            <BadgeDetailsDialog badge={badge} key={badge.id}>
              <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                 <Image
                    src={badge.iconUrl}
                    alt={badge.name}
                    width={40}
                    height={40}
                    className={`rounded-lg transition-all duration-300 ${badge.earned ? '' : 'grayscale opacity-50'}`}
                    data-ai-hint={badge.dataAiHint || 'badge icon'}
                  />
                <div className="flex-1">
                  <p className={`font-semibold ${badge.earned ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            </BadgeDetailsDialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


export default function DashboardPage() {
  const { user } = useAuth();

  const handleRedirectToPiApp = () => {
    window.open(PI_APP_MINING_URL, '_blank');
  };

  if (!user) {
    return ( 
      <div className="flex h-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const activeTeamMembers = mockTeam.filter(m => m.status === 'active').length;
  const totalTeamMembers = mockTeam.length;

  return (
    <div className="space-y-6">
      
      {/* KPIs Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pi Balance"
          value={user.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' π'}
          icon={<Banknote />}
          footerValue={`~$${(user.totalBalance * 0.42).toFixed(2)} USD`}
          change="+2.3%"
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer">
              <KPICard
                title="Analytics Rate"
                value={`${user.miningRate.toFixed(2)} π/hr`}
                icon={<Gauge />}
                footerValue="Ready to analyze"
                badgeText="Active"
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
            title="Team Members"
            value={`${activeTeamMembers}`}
            icon={<UsersIcon />}
            footerValue={`${totalTeamMembers - activeTeamMembers} inactive`}
            badgeText={`+${totalTeamMembers - activeTeamMembers}`}
          />
        </Link>
        
        {user.isNodeOperator && user.nodeUptimePercentage !== undefined && (
          <Link href="/dashboard/node" className="block">
            <KPICard
              title="Node Status"
              value={`${user.nodeUptimePercentage.toFixed(1)}%`}
              icon={<Server />}
              footerValue="Uptime this month"
              badgeText="Offline"
              badgeVariant="secondary"
            />
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <MyBadges />
      </div>

    </div>
  );
}
