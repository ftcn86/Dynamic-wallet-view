"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Gift, ListTree, Server } from 'lucide-react'; 

interface UnverifiedPiSource {
  key: keyof NonNullable<ReturnType<typeof useAuth>['user']>['unverifiedPiDetails'];
  label: string;
  icon: JSX.Element;
  value: number;
}

export function UnverifiedPiDetailCard() {
  const { user } = useAuth();

  if (!user || !user.unverifiedPiDetails) return null;

  const { fromReferralTeam, fromSecurityCircle, fromNodeRewards, fromOtherBonuses } = user.unverifiedPiDetails;

  const sources: UnverifiedPiSource[] = [
    {
      key: 'fromReferralTeam',
      label: 'From Referral Team',
      icon: <Users className="h-5 w-5 text-primary/80" />,
      value: fromReferralTeam,
    },
    {
      key: 'fromSecurityCircle',
      label: 'From Security Circle',
      icon: <Shield className="h-5 w-5 text-green-600" />,
      value: fromSecurityCircle,
    },
    {
      key: 'fromNodeRewards',
      label: 'From Node Rewards',
      icon: <Server className="h-5 w-5 text-blue-500" />, 
      value: fromNodeRewards,
    },
    {
      key: 'fromOtherBonuses',
      label: 'From Other Bonuses',
      icon: <Gift className="h-5 w-5 text-yellow-500" />,
      value: fromOtherBonuses,
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ListTree className="mr-2 h-6 w-6 text-primary" />
          Unverified Pi Sources
        </CardTitle>
        <CardDescription>
          A breakdown of your Pi that is not yet verified.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sources.map((source) => (
          <div key={source.key} className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              {source.icon}
              <span className="ml-2">{source.label}</span>
            </div>
            <span className="font-medium">{Number(source.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Pi</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">These amounts become transferable as your connections complete KYC or other conditions are met.</p>
      </CardFooter>
    </Card>
  );
}
