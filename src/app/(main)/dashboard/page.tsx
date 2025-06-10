
"use client"

import Link from 'next/link';
import { Banknote, Gauge, Users as UsersIcon, Server } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.balanceBreakdown.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(user.balanceBreakdown).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t(`dashboard.balanceBreakdown.${key}`)}</span>
            <span className="font-medium">{Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Pi</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{t('dashboard.balanceBreakdown.disclaimer')}</p>
      </CardFooter>
    </Card>
  );
}

function UnverifiedBalanceChart() {
  const { t } = useTranslation();
  const [timePeriod, setTimePeriod] = useState<keyof typeof mockChartData>('6M');
  
  const chartData = mockChartData[timePeriod];

  const chartConfig = {
    transferable: {
      label: t('dashboard.unverifiedBalanceChart.tooltipLabelTransferable'),
      color: "hsl(var(--primary))",
    },
    unverified: {
      label: t('dashboard.unverifiedBalanceChart.tooltipLabelUnverified'),
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline">{t('dashboard.unverifiedBalanceChart.title')}</CardTitle>
        <Select value={timePeriod} onValueChange={(value: keyof typeof mockChartData) => setTimePeriod(value)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder={t('dashboard.unverifiedBalanceChart.periods.sixMonths')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3M">{t('dashboard.unverifiedBalanceChart.periods.threeMonths')}</SelectItem>
            <SelectItem value="6M">{t('dashboard.unverifiedBalanceChart.periods.sixMonths')}</SelectItem>
            <SelectItem value="12M">{t('dashboard.unverifiedBalanceChart.periods.twelveMonths')}</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <RechartsPrimitive.BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <RechartsPrimitive.XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM yy')} />
            <RechartsPrimitive.YAxis label={{ value: t('dashboard.unverifiedBalanceChart.yAxisLabel'), angle: -90, position: 'insideLeft' }} />
            <RechartsPrimitive.Legend />
            <RechartsPrimitive.Bar dataKey="transferable" fill="var(--color-transferable)" radius={4} name={t('dashboard.unverifiedBalanceChart.tooltipLabelTransferable')} />
            <RechartsPrimitive.Bar dataKey="unverified" fill="var(--color-unverified)" radius={4} name={t('dashboard.unverifiedBalanceChart.tooltipLabelUnverified')} />
          </RechartsPrimitive.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function BadgeDetailsDialog({ badge, children }: { badge: Badge, children: React.ReactNode }) {
  const { t } = useTranslation();
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
            {t('dashboard.myBadges.earnedOn')}: {format(new Date(badge.earnedDate), 'MMMM d, yyyy')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


function MyBadges() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || !user.badges) return null;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{t('dashboard.myBadges.title')}</CardTitle>
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
  const { t } = useTranslation();

  const handleRedirectToPiApp = () => {
    window.open(PI_APP_MINING_URL, '_blank');
  };

  if (!user) {
    return ( 
      <div className="flex h-full items-center justify-center">
        <p>{t('shared.loading')}</p>
      </div>
    );
  }

  const activeTeamMembers = mockTeam.filter(m => m.status === 'active').length;
  const totalTeamMembers = mockTeam.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('dashboard.title')}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t('dashboard.kpi_balance')}
          value={user.totalBalance.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4}) + ' Pi'}
          icon={<Banknote />}
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="cursor-pointer">
              <KPICard
                title={t('dashboard.kpi_rate')}
                value={`${user.miningRate.toFixed(4)} Pi/hr`}
                icon={<Gauge />}
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dashboard.miningRateRedirect.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('dashboard.miningRateRedirect.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('dashboard.miningRateRedirect.cancelButton')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleRedirectToPiApp}>
                {t('dashboard.miningRateRedirect.confirmButton')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {user.isNodeOperator && user.nodeUptimePercentage !== undefined && (
          <Link href="/dashboard/node" className="block">
            <KPICard
              title={t('dashboard.kpi_node_uptime')}
              value={`${user.nodeUptimePercentage.toFixed(2)}%`}
              icon={<Server />}
            />
          </Link>
        )}

        <Link href="/dashboard/team" className="block">
          <KPICard
            title={t('dashboard.kpi_team')}
            value={`${activeTeamMembers} / ${totalTeamMembers}`}
            icon={<UsersIcon />}
          />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BalanceBreakdownCard />
        <UnverifiedPiDetailCard />
      </div>
      
      <MiningFocusCard />
      <TeamActivityCard />

      <div className="grid gap-6 lg:grid-cols-1"> 
        <UnverifiedBalanceChart />
      </div>
      
      <MyBadges />

    </div>
  );
}

