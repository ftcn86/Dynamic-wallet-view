"use client"

import Link from 'next/link';
import { Banknote, Gauge, Users as UsersIcon, Server } from 'lucide-react';
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
  AlertDialogTrigger,
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

function BalanceBreakdownCard() {
  const { user } = useAuth();

  if (!user) return null;

  const breakdownItems = [
    { label: "Transferable to Mainnet", value: user.balanceBreakdown.transferableToMainnet },
    { label: "Total Unverified Pi", value: user.balanceBreakdown.totalUnverifiedPi },
    { label: "Currently in Lockups", value: user.balanceBreakdown.currentlyInLockups }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Balance Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {breakdownItems.map((item) => (
          <div key={item.label} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-medium">{Number(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Pi</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Note: Unverified Pi requires associated members to complete KYC to become transferable.</p>
      </CardFooter>
    </Card>
  );
}

function UnverifiedBalanceChart() {
  const [timePeriod, setTimePeriod] = useState<keyof typeof mockChartData>('6M');
  
  const chartData = mockChartData[timePeriod];

  const chartConfig = {
    transferable: {
      label: "Transferable",
      color: "hsl(var(--primary))",
    },
    unverified: {
      label: "Unverified",
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">Balance Fluctuation</CardTitle>
        <Select value={timePeriod} onValueChange={(value: keyof typeof mockChartData) => setTimePeriod(value)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="6M" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3M">3M</SelectItem>
            <SelectItem value="6M">6M</SelectItem>
            <SelectItem value="12M">12M</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <RechartsPrimitive.BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <RechartsPrimitive.XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM yy')} />
            <RechartsPrimitive.YAxis label={{ value: "Pi Amount", angle: -90, position: 'insideLeft' }} />
            <RechartsPrimitive.Legend />
            <RechartsPrimitive.Bar dataKey="transferable" fill="var(--color-transferable)" radius={4} name="Transferable" />
            <RechartsPrimitive.Bar dataKey="unverified" fill="var(--color-unverified)" radius={4} name="Unverified" />
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">My Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {user.badges.map((badge) => (
            <BadgeDetailsDialog badge={badge} key={badge.id}>
              <button className="flex flex-col items-center space-y-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1">
                 <Image
                    src={badge.iconUrl}
                    alt={badge.name}
                    width={64}
                    height={64}
                    className={`rounded-lg transition-all duration-300 group-hover:scale-110 ${badge.earned ? '' : 'grayscale opacity-50'}`}
                    data-ai-hint={badge.dataAiHint || 'badge icon'}
                  />
                <span className={`text-xs text-center ${badge.earned ? 'font-medium' : 'text-muted-foreground'}`}>
                  {badge.name}
                </span>
              </button>
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
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Pi Balance"
          value={user.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4}) + ' Pi'}
          icon={<Banknote className="h-5 w-5 text-primary" />}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer">
              <KPICard
                title="Current Mining Rate"
                value={`${user.miningRate.toFixed(4)} Pi/hr`}
                icon={<Gauge className="h-5 w-5 text-accent" />}
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
        
        {user.isNodeOperator && user.nodeUptimePercentage !== undefined && (
          <Link href="/dashboard/node" className="block">
            <KPICard
              title="Node Uptime"
              value={`${user.nodeUptimePercentage.toFixed(2)}%`}
              icon={<Server className="h-5 w-5 text-primary" />}
            />
          </Link>
        )}

        <Link href="/dashboard/team" className="block">
          <KPICard
            title="Active Team Members"
            value={`${activeTeamMembers} / ${totalTeamMembers}`}
            icon={<UsersIcon className="h-5 w-5 text-accent" />}
          />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BalanceBreakdownCard />
        <UnverifiedPiDetailCard />
      </div>
      
      <UnverifiedBalanceChart />
      <MiningFocusCard />
      <TeamActivityCard />
      <MyBadges />

    </div>
  );
}
