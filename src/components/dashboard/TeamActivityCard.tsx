"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import type { Badge as BadgeType } from '@/data/schemas';
import { mockTeam, GAMIFICATION_BADGE_IDS } from '@/data/mocks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, ChevronRight, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_LEADERBOARD_ENTRIES = 10;
const DISPLAY_RECENT_BADGES_COUNT = 3;

export function TeamActivityCard() {
  const { user } = useAuth();
  const team = mockTeam; 

  if (!user) return null;

  const leaderboard = team
    .filter(member => member.status === 'active' && typeof member.teamMemberActiveMiningHours_LastWeek === 'number')
    .map(member => ({
      ...member,
      activity: member.teamMemberActiveMiningHours_LastWeek!,
    }))
    .sort((a, b) => b.activity - a.activity);

  const displayLeaderboard = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);

  const userWeeklyActivity = user.userActiveMiningHours_LastWeek ?? 0;
  const userMonthlyActivity = user.userActiveMiningHours_LastMonth ?? 0;

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
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1")}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-primary" />
          Team Mining Rally
        </CardTitle>
        <CardDescription>
          Your Activity: {userWeeklyActivity} hrs (Last Week), {userMonthlyActivity} hrs (Last Month)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2">
            {leaderboard.length > MAX_LEADERBOARD_ENTRIES
              ? "Weekly Team Rally (Top 10)"
              : "Weekly Team Rally"}
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
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person face" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{member.activity} hrs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             team.length === 0 ? <p className="text-sm text-muted-foreground">No team members to display activity for yet.</p>
                               : <p className="text-sm text-muted-foreground">No activity data to display for the team.</p>
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
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
              {earnedGamificationBadges.map(badge => (
                <div key={badge.id} className="flex flex-col items-center text-center p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <Image src={badge.iconUrl} alt={badge.name} width={48} height={48} className="rounded-md mb-1" data-ai-hint={badge.dataAiHint || 'badge icon'}/>
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
            <ChevronRight className="ml-2 h-4 w-4 text-primary" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
