
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

// Solid SVG Icons
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#22c55e" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b" {...props}>
        <path d="M20 12v10H4V12" stroke="#fff" strokeWidth="1.5" />
        <path d="M2 7h20v5H2z" stroke="#fff" strokeWidth="1.5" />
        <path d="M12 22V7" stroke="#fff" strokeWidth="1.5" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="#fff" strokeWidth="1.5" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="#fff" strokeWidth="1.5" />
    </svg>
);

const ListTreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M21 12h-4" stroke="#fff" strokeWidth="2" />
        <path d="M15 6h-4" stroke="#fff" strokeWidth="2" />
        <path d="M17 18h-4" stroke="#fff" strokeWidth="2" />
        <path d="M3 6h4" />
        <path d="M3 12h8" />
        <path d="M3 18h6" />
        <circle cx="4" cy="6" r="1" fill="#fff" />
        <circle cx="6" cy="12" r="1" fill="#fff" />
        <circle cx="5" cy="18" r="1" fill="#fff" />
    </svg>
);

const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="#fff" strokeWidth="2"/>
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="#fff" strokeWidth="2"/>
    </svg>
);


interface UnverifiedPiSource {
  key: keyof NonNullable<ReturnType<typeof useAuth>['user']>['unverifiedPiDetails'];
  label: string;
  icon: JSX.Element;
  value: number;
}

export function UnverifiedPiDetailCard() {
  const { user } = useAuth();

  if (!user) return (
     <Card className={cn("shadow-lg")}>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
    </Card>
  );

  const { fromReferralTeam, fromSecurityCircle, fromNodeRewards, fromOtherBonuses } = user.unverifiedPiDetails;

  const sources: UnverifiedPiSource[] = [
    { key: 'fromReferralTeam', label: 'From Referral Team', icon: <UsersIcon className="h-5 w-5" />, value: fromReferralTeam },
    { key: 'fromSecurityCircle', label: 'From Security Circle', icon: <ShieldIcon className="h-5 w-5" />, value: fromSecurityCircle },
    { key: 'fromNodeRewards', label: 'From Node Rewards', icon: <ServerIcon className="h-5 w-5" />, value: fromNodeRewards },
    { key: 'fromOtherBonuses', label: 'From Other Bonuses', icon: <GiftIcon className="h-5 w-5" />, value: fromOtherBonuses },
  ];

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300")}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ListTreeIcon className="mr-2 h-6 w-6" />
          Unverified Pi Sources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sources.map((source) => (
          <div key={source.key} className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              {source.icon}
              <span className="ml-2">{source.label}</span>
            </div>
            <span className="font-mono font-medium">{source.value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} π</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">These amounts become transferable as your connections complete KYC.</p>
      </CardFooter>
    </Card>
  );
}
