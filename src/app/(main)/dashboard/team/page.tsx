"use client"

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import { mockApiCall } from '@/lib/api';
import { mockTeam } from '@/data/mocks';
import type { TeamMember } from '@/data/schemas';
import { format } from 'date-fns';
import { Info, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function TeamMemberRow({ member }: { member: TeamMember }) {
  const { t } = useTranslation();

  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  if (member.status === 'active') badgeVariant = 'default'; // Default is primary-like green
  if (member.status === 'pending') badgeVariant = 'outline'; // Yellowish

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person face" />
            <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{member.name}</span>
        </div>
      </TableCell>
      <TableCell>{format(new Date(member.joinDate), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <Badge variant={badgeVariant} className={
          member.status === 'active' ? 'bg-green-500 hover:bg-green-600 text-white' :
          member.status === 'pending' ? 'bg-yellow-400 hover:bg-yellow-500 text-black' :
          'bg-gray-400 hover:bg-gray-500 text-white' // inactive
        }>
          {t(`teamInsights.statusValues.${member.status}`)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          {member.unverifiedPiContribution.toFixed(2)} Pi
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('teamInsights.contributionTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TeamMembersTableSkeleton() {
  const { t } = useTranslation();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('teamInsights.columns.member')}</TableHead>
          <TableHead>{t('teamInsights.columns.joinDate')}</TableHead>
          <TableHead>{t('teamInsights.columns.status')}</TableHead>
          <TableHead className="text-right">{t('teamInsights.columns.contribution')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function TeamInsightsPage() {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamMembers() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockApiCall({ data: mockTeam });
        setTeamMembers(data);
      } catch (err) {
        setError(t('teamInsights.error'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeamMembers();
  }, [t]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('teamInsights.title')}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            {t('teamInsights.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TeamMembersTableSkeleton />}
          {!isLoading && error && <p className="text-destructive text-center py-8">{error}</p>}
          {!isLoading && !error && teamMembers.length === 0 && (
            <p className="text-muted-foreground text-center py-8">{t('teamInsights.empty')}</p>
          )}
          {!isLoading && !error && teamMembers.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('teamInsights.columns.member')}</TableHead>
                  <TableHead>{t('teamInsights.columns.joinDate')}</TableHead>
                  <TableHead>{t('teamInsights.columns.status')}</TableHead>
                  <TableHead className="text-right">{t('teamInsights.columns.contribution')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TeamMemberRow key={member.id} member={member} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
