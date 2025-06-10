"use client"

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import type { TeamMember, Badge as BadgeType } from '@/data/schemas';
import { mockTeam, GAMIFICATION_BADGE_IDS } from '@/data/mocks'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, ChevronRight, Award } from 'lucide-react';
// Removed Users icon as it was not used in the final design of this card.

const MAX_LEADERBOARD_ENTRIES = 10;
const DISPLAY_RECENT_BADGES_COUNT = 3;

export function TeamActivityCard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  // In a real app, team data would come via props or context, not directly from mocks.
  const team = mockTeam; // Assuming mockTeam is available and updated with activity hours

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

  // Calculate user's rank in the full list including their own activity
  const fullActivityList = [
    ...leaderboard.map(m => ({ name: m.name, activity: m.activity, id: m.id })), 
    { name: user.name, activity: userWeeklyActivity, id: user.id }
  ];
  
  // Deduplicate in case user is also in mockTeam (e.g. for testing, though ideally user is separate)
  const uniqueActivityList = Array.from(new Map(fullActivityList.map(item => [item.id, item])).values())
                              .sort((a,b) => b.activity - a.activity);
  
  const userRankInFullList = uniqueActivityList.findIndex(u => u.id === user.id) +1;


  const earnedGamificationBadges = user.badges
    .filter(badge => badge.earned && GAMIFICATION_BADGE_IDS.includes(badge.id))
    .sort((a, b) => new Date(b.earnedDate || 0).getTime() - new Date(a.earnedDate || 0).getTime()) 
    .slice(0, DISPLAY_RECENT_BADGES_COUNT);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Trophy className="mr-2 h-6 w-6 text-primary" />
          {t('dashboard.teamActivity.title')}
        </CardTitle>
        <CardDescription>
          {t('dashboard.teamActivity.yourActivity')}: {userWeeklyActivity} {t('dashboard.teamActivity.hoursSuffix')} ({t('dashboard.teamActivity.lastWeek')}), {userMonthlyActivity} {t('dashboard.teamActivity.hoursSuffix')} ({t('dashboard.teamActivity.lastMonth')})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2">
            {leaderboard.length > MAX_LEADERBOARD_ENTRIES 
              ? t('dashboard.teamActivity.teamRallyTop10') 
              : t('dashboard.teamActivity.teamRallyWeekly')}
          </h3>
          {displayLeaderboard.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-center">{t('dashboard.teamActivity.rank')}</TableHead>
                    <TableHead>{t('dashboard.teamActivity.member')}</TableHead>
                    <TableHead className="text-right">{t('dashboard.teamActivity.hours')}</TableHead>
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
                      <TableCell className="text-right">{member.activity} {t('dashboard.teamActivity.hoursSuffix')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             team.length === 0 ? <p className="text-sm text-muted-foreground">{t('dashboard.teamActivity.noTeamMembers')}</p> 
                               : <p className="text-sm text-muted-foreground">{t('dashboard.teamActivity.noActivity')}</p>
          )}
          {/* Show user's rank if they are not in the displayed top 10 and there are more than 10 members */}
          {leaderboard.length > MAX_LEADERBOARD_ENTRIES && userRankInFullList > MAX_LEADERBOARD_ENTRIES && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {t('dashboard.teamActivity.yourRank', { rank: userRankInFullList, hours: userWeeklyActivity })}
            </p>
          )}
        </div>

        {earnedGamificationBadges.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              {t('dashboard.teamActivity.newlyEarnedBadges')}
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
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
            {t('dashboard.teamActivity.viewFullTeamReport')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
