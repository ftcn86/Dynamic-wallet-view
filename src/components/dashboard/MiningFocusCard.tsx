
"use client"

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getDaysInMonth, subMonths, isValid } from 'date-fns';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Solid SVG Icons
const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" fill="#fff" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="#fff" strokeWidth="2" />
        <path d="M8 14h.01" stroke="#fff" strokeWidth="2" />
        <path d="M12 14h.01" stroke="#fff" strokeWidth="2" />
        <path d="M16 14h.01" stroke="#fff" strokeWidth="2" />
        <path d="M8 18h.01" stroke="#fff" strokeWidth="2" />
        <path d="M12 18h.01" stroke="#fff" strokeWidth="2" />
        <path d="M16 18h.01" stroke="#fff" strokeWidth="2" />
    </svg>
);


export function MiningFocusCard() {
  const { user } = useAuth();
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
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300")}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <TargetIcon className="mr-2 h-6 w-6 text-primary" />
          Mining Focus
        </CardTitle>
        <CardDescription>Track your personal mining goals and stay motivated!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <CalendarDaysIcon className="mr-1.5 h-4 w-4 text-accent" />
              Weekly Goal
            </h3>
            {isWeeklyGoalMet && <Badge variant="success">Goal Met!</Badge>}
          </div>
          <Progress value={weeklyProgressPercent} aria-label="Weekly mining goal" />
          <p className="text-sm text-muted-foreground text-right">
            {activeMiningDaysLastWeek.toFixed(0)} / {displayWeeklyTarget.toFixed(0)} days
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
              <CalendarDaysIcon className="mr-1.5 h-4 w-4 text-accent" />
              Monthly Goal
            </h3>
            {isMonthlyGoalMet && <Badge variant="success">Goal Met!</Badge>}
          </div>
          <Progress value={monthlyProgressPercent} aria-label="Monthly mining goal" />
          <p className="text-sm text-muted-foreground text-right">
            {activeMiningDaysLastMonth.toFixed(0)} / {displayMonthlyTarget.toFixed(0)} days
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-start text-sm text-muted-foreground">
                <UsersIcon className="mr-3 h-6 w-6 text-primary flex-shrink-0 mt-1"/>
                <p>Encourage your team to stay active! Their contributions help the network grow.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
