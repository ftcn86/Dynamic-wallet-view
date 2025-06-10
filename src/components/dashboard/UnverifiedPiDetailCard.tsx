
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Gift, ListTree } from 'lucide-react'; // Added ListTree as a generic icon

interface UnverifiedPiSource {
  key: keyof NonNullable<ReturnType<typeof useAuth>['user']>['unverifiedPiDetails'];
  labelKey: string;
  icon: JSX.Element;
  value: number;
}

export function UnverifiedPiDetailCard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || !user.unverifiedPiDetails) return null;

  const { fromReferralTeam, fromSecurityCircle, fromOtherBonuses } = user.unverifiedPiDetails;

  const sources: UnverifiedPiSource[] = [
    {
      key: 'fromReferralTeam',
      labelKey: 'dashboard.unverifiedPiDetail.fromReferralTeam',
      icon: <Users className="h-5 w-5 text-primary/80" />,
      value: fromReferralTeam,
    },
    {
      key: 'fromSecurityCircle',
      labelKey: 'dashboard.unverifiedPiDetail.fromSecurityCircle',
      icon: <Shield className="h-5 w-5 text-primary/80" />,
      value: fromSecurityCircle,
    },
    {
      key: 'fromOtherBonuses',
      labelKey: 'dashboard.unverifiedPiDetail.fromOtherBonuses',
      icon: <Gift className="h-5 w-5 text-primary/80" />,
      value: fromOtherBonuses,
    },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <ListTree className="mr-2 h-6 w-6 text-primary" />
          {t('dashboard.unverifiedPiDetail.title')}
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
              <span className="ml-2">{t(source.labelKey)}</span>
            </div>
            <span className="font-medium">{Number(source.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} Pi</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{t('dashboard.unverifiedPiDetail.disclaimer')}</p>
      </CardFooter>
    </Card>
  );
}
