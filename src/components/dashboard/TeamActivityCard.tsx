
"use client"

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { mockTeam, GAMIFICATION_BADGE_IDS } from '@/data/mocks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { BadgeIcon } from './badge/BadgeIcon';
import { useTranslation } from '@/hooks/useTranslation';

// Solid SVG Icons
const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="hsl(var(--primary))" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M4 22h16" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M10 14.66V22h4v-7.34" stroke="#fff" strokeWidth="1.5" fill="none" />
        <path d="M12 15c-3.87 0-7-3.13-7-7V4h14v4c0 3.87-3.13 7-7 7z" />
    </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="#f59e0b" {...props}>
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"/>
    </svg>
);

const MAX_LEADERBOARD_ENTRIES = 5;
const DISPLAY_RECENT_BADGES_COUNT = 3;

export function TeamActivityCard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const team = mockTeam; 

  if (!user) return (
     <Card className={cn("shadow-lg")}>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  const leaderboard = team
    .filter(member => member.status === 'active' && typeof member.teamMemberActiveMiningHours_LastWeek === 'number')
    .map(member => ({
      ...member,
      activity: member.teamMemberActiveMiningHours_LastWeek!,
    }))
    .sort((a, b) => b.activity - a.activity);

  const displayLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);

  const userWeeklyActivity = user.userActiveMiningHours_LastWeek ?? 0;

  const fullActivityList = [
    ...leaderboard.map(m => ({ name: m.name, activity: m.activity, id: m.id })),
    { name: user.name, activity: userWeeklyActivity, id: user.id }
  ];

  const uniqueActivityList = Array.from(new Map(fullActivityList.map(item => [item.id, item])).values())
                              .sort((a,b) => b.activity - a.activity);

  const userRankInFullList = uniqueActivityList.findIndex(u => u.id === user.id) +1;

  const userBadges = user.badges || [];

  const earnedGamificationBadges = userBadges
    .filter(badge => badge.earned && GAMIFICATION_BADGE_IDS.includes(badge.id))
    .sort((a, b) => new Date(b.earnedDate || 0).getTime() - new Date(a.earnedDate || 0).getTime())
    .slice(0, DISPLAY_RECENT_BADGES_COUNT);


  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300")}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <TrophyIcon className="mr-2 h-6 w-6" />
          Team Mining Rally
        </CardTitle>
        <CardDescription>
          See how your team is performing and celebrate recent achievements.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2">
            Weekly Team Rally (Top 5)
          </h3>
          {displayLeaderboard.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-center">Rank</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayLeaderboard.map((member, index) => (
                    <TableRow key={member.id} className={member.id === user.id ? 'bg-primary/10' : ''}>
                      <TableCell className="font-medium text-center">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.dataAiHint} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{member.activity} hrs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="text-center py-8 rounded-lg border-2 border-dashed">
                <p className="text-sm text-muted-foreground">
                    {t('dashboard.teamActivity.noActivity')}
                </p>
             </div>
          )}
          {leaderboard.length > MAX_LEADERBOARD_ENTRIES && userRankInFullList > MAX_LEADERBOARD_ENTRIES && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Your Rank: #{userRankInFullList} ({userWeeklyActivity} hrs)
            </p>
          )}
        </div>

        {earnedGamificationBadges.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <AwardIcon className="mr-2 h-5 w-5" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
              {earnedGamificationBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center text-center p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <BadgeIcon badgeId={badge.id} earned={badge.earned} size="md" className="mb-1" />
                  <span className="text-xs font-medium truncate w-full">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard/team">
            View Full Team Report
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
