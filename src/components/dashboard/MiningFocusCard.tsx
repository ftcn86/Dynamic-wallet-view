
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Users } from 'lucide-react';

export function MiningFocusCard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const {
    weeklyMiningProgress = 0,
    weeklyMiningTarget = 0,
    monthlyMiningProgress = 0,
    monthlyMiningTarget = 0,
  } = user;

  const weeklyProgressPercent = weeklyMiningTarget > 0 ? (weeklyMiningProgress / weeklyMiningTarget) * 100 : 0;
  const monthlyProgressPercent = monthlyMiningTarget > 0 ? (monthlyMiningProgress / monthlyMiningTarget) * 100 : 0;

  const isWeeklyGoalMet = weeklyMiningProgress >= weeklyMiningTarget && weeklyMiningTarget > 0;
  const isMonthlyGoalMet = monthlyMiningProgress >= monthlyMiningTarget && monthlyMiningTarget > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Target className="mr-2 h-6 w-6 text-primary" />
          {t('dashboard.miningFocus.title')}
        </CardTitle>
        <CardDescription>{t('dashboard.miningFocus.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {weeklyMiningTarget > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.miningFocus.weeklyGoal')}</h3>
              {isWeeklyGoalMet && <Badge variant="success">{t('dashboard.miningFocus.goalAchieved')}</Badge>}
            </div>
            <Progress value={weeklyProgressPercent} aria-label={t('dashboard.miningFocus.weeklyGoal')} />
            <p className="text-sm text-muted-foreground text-right">
              {weeklyMiningProgress.toFixed(2)} / {weeklyMiningTarget.toFixed(2)} Pi
            </p>
            {!isWeeklyGoalMet && weeklyMiningTarget > 0 && (
              <p className="text-xs text-primary text-center">{t('dashboard.miningFocus.keepGoing')}</p>
            )}
          </div>
        )}

        {monthlyMiningTarget > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.miningFocus.monthlyGoal')}</h3>
              {isMonthlyGoalMet && <Badge variant="success">{t('dashboard.miningFocus.goalAchieved')}</Badge>}
            </div>
            <Progress value={monthlyProgressPercent} aria-label={t('dashboard.miningFocus.monthlyGoal')} />
            <p className="text-sm text-muted-foreground text-right">
              {monthlyMiningProgress.toFixed(2)} / {monthlyMiningTarget.toFixed(2)} Pi
            </p>
            {!isMonthlyGoalMet && monthlyMiningTarget > 0 && (
               <p className="text-xs text-primary text-center">{t('dashboard.miningFocus.greatProgress')}</p>
            )}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-5 w-5 text-primary/80"/>
                <p>{t('dashboard.miningFocus.teamEncouragement')}</p>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
