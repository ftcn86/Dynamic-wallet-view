"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function BalanceBreakdownCard() {
  const { user } = useAuth();

  if (!user) return null;

  const breakdownItems = [
    { label: "Transferable to Mainnet", value: user.balanceBreakdown.transferableToMainnet },
    { label: "Total Unverified Pi", value: user.balanceBreakdown.totalUnverifiedPi },
    { label: "Currently in Lockups", value: user.balanceBreakdown.currentlyInLockups },
  ];

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1")}>
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
