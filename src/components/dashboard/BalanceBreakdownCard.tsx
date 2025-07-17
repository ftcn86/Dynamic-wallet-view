
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export function BalanceBreakdownCard() {
  const { user } = useAuth();

  if (!user) return (
    <Card className={cn("shadow-lg")}>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-full" />
      </CardFooter>
    </Card>
  );

  // Conditional Rendering: Only render if balance breakdown data is available.
  if (!user.balanceBreakdown) {
    return null;
  }

  const breakdownItems = [
    { label: "Transferable to Mainnet", value: user.balanceBreakdown.transferableToMainnet },
    { label: "Total Unverified Pi", value: user.balanceBreakdown.totalUnverifiedPi },
    { label: "Currently in Lockups", value: user.balanceBreakdown.currentlyInLockups },
  ];

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300")}>
      <CardHeader>
        <CardTitle className="font-headline">Balance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {breakdownItems.map(item => (
            <li key={item.label} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono font-medium">{item.value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} π</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Note: Unverified Pi requires associated members to complete KYC to become transferable.</p>
      </CardFooter>
    </Card>
  );
}
