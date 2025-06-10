
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Users, CalendarDays } from 'lucide-react';
import { getDaysInMonth, subMonths, isValid } from 'date-fns';
import { useEffect, useState } from 'react';

export function MiningFocusCard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [daysInPreviousMonth, setDaysInPreviousMonth] = useState(30); 

  useEffect(() => {
    const today = new Date();
    const prevMonthDate = subMonths(today, 1);
    if (isValid(prevMonthDate)) {
      setDaysInPreviousMonth(getDaysInMonth(prevMonthDate));
    }
  }, []);


  if (!user) return null;

  const activeMiningDaysLastWeek = user.activeMiningDays_LastWeek ?? 0;
  const activeMiningDaysLastMonth = user.activeMiningDays_LastMonth ?? 0;

  const weeklyTargetDays = 7; 
  const monthlyTargetDays = daysInPreviousMonth; 

  const weeklyProgressPercent = weeklyTargetDays > 0 ? (activeMiningDaysLastWeek / weeklyTargetDays) * 100 : 0;
  const monthlyProgressPercent = monthlyTargetDays > 0 ? (activeMiningDaysLastMonth / monthlyTargetDays) * 100 : 0;

  const isWeeklyGoalMet = weeklyTargetDays > 0 && activeMiningDaysLastWeek >= weeklyTargetDays;
  const isMonthlyGoalMet = monthlyTargetDays > 0 && activeMiningDaysLastMonth >= monthlyTargetDays;

  const displayWeeklyTarget = weeklyTargetDays;
  const displayMonthlyTarget = monthlyTargetDays;


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
        {displayWeeklyTarget > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4 text-accent" />
                {t('dashboard.miningFocus.weeklyGoal')}
              </h3>
              {isWeeklyGoalMet && <Badge variant="success">{t('dashboard.miningFocus.goalAchieved')}</Badge>}
            </div>
            <Progress value={weeklyProgressPercent} aria-label={t('dashboard.miningFocus.weeklyGoal')} />
            <p className="text-sm text-muted-foreground text-right">
              {activeMiningDaysLastWeek.toFixed(0)} / {displayWeeklyTarget.toFixed(0)} {t('dashboard.miningFocus.daysSuffix')}
            </p>
            {!isWeeklyGoalMet && displayWeeklyTarget > 0 && (
              <p className="text-xs text-primary text-center">{t('dashboard.miningFocus.keepGoing')}</p>
            )}
          </div>
        )}

        {displayMonthlyTarget > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4 text-accent" />
                {t('dashboard.miningFocus.monthlyGoal')}
              </h3>
              {isMonthlyGoalMet && <Badge variant="success">{t('dashboard.miningFocus.goalAchieved')}</Badge>}
            </div>
            <Progress value={monthlyProgressPercent} aria-label={t('dashboard.miningFocus.monthlyGoal')} />
            <p className="text-sm text-muted-foreground text-right">
              {activeMiningDaysLastMonth.toFixed(0)} / {displayMonthlyTarget.toFixed(0)} {t('dashboard.miningFocus.daysSuffix')}
            </p>
            {!isMonthlyGoalMet && displayMonthlyTarget > 0 && (
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
