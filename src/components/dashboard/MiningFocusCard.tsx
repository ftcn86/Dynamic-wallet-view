
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Users, Clock } from 'lucide-react'; // Added Clock icon

export function MiningFocusCard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const {
    userActiveMiningHours_LastWeek = 0,
    weeklyMiningTargetHours = 0,
    userActiveMiningHours_LastMonth = 0,
    monthlyMiningTargetHours = 0,
  } = user;

  const weeklyProgressPercent = weeklyMiningTargetHours > 0 ? (userActiveMiningHours_LastWeek / weeklyMiningTargetHours) * 100 : 0;
  const monthlyProgressPercent = monthlyMiningTargetHours > 0 ? (userActiveMiningHours_LastMonth / monthlyMiningTargetHours) * 100 : 0;

  const isWeeklyGoalMet = weeklyMiningTargetHours > 0 && userActiveMiningHours_LastWeek >= weeklyMiningTargetHours;
  const isMonthlyGoalMet = monthlyMiningTargetHours > 0 && userActiveMiningHours_LastMonth >= monthlyMiningTargetHours;

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
        {weeklyMiningTargetHours > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-1.5 h-4 w-4" /> 
                {t('dashboard.miningFocus.weeklyGoal')}
              </h3>
              {isWeeklyGoalMet && <Badge variant="success">{t('dashboard.miningFocus.goalAchieved')}</Badge>}
            </div>
            <Progress value={weeklyProgressPercent} aria-label={t('dashboard.miningFocus.weeklyGoal')} />
            <p className="text-sm text-muted-foreground text-right">
              {userActiveMiningHours_LastWeek.toFixed(0)} / {weeklyMiningTargetHours.toFixed(0)} {t('dashboard.teamActivity.hoursSuffix')}
            </p>
            {!isWeeklyGoalMet && weeklyMiningTargetHours > 0 && (
              <p className="text-xs text-primary text-center">{t('dashboard.miningFocus.keepGoing')}</p>
            )}
          </div>
        )}

        {monthlyMiningTargetHours > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="mr-1.5 h-4 w-4" />
                {t('dashboard.miningFocus.monthlyGoal')}
              </h3>
              {isMonthlyGoalMet && <Badge variant="success">{t('dashboard.miningFocus.goalAchieved')}</Badge>}
            </div>
            <Progress value={monthlyProgressPercent} aria-label={t('dashboard.miningFocus.monthlyGoal')} />
            <p className="text-sm text-muted-foreground text-right">
              {userActiveMiningHours_LastMonth.toFixed(0)} / {monthlyMiningTargetHours.toFixed(0)} {t('dashboard.teamActivity.hoursSuffix')}
            </p>
            {!isMonthlyGoalMet && monthlyMiningTargetHours > 0 && (
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
