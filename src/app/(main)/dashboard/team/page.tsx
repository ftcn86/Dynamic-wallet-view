
"use client"

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import { mockApiCall } from '@/lib/api';
import { mockTeam } from '@/data/mocks';
import type { TeamMember, KycStatus } from '@/data/schemas';
import { format } from 'date-fns';
import { Info, Users, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { KycStatusBadge } from '@/components/shared/KycStatusBadge'; 
import { Badge as UiBadge } from '@/components/ui/badge';


type SortableKeys = keyof Pick<TeamMember, 'name' | 'joinDate' | 'status' | 'unverifiedPiContribution' | 'teamMemberActiveMiningHours_LastWeek' | 'teamMemberActiveMiningHours_LastMonth' | 'kycStatus'>;

interface SortConfig {
  key: SortableKeys | null;
  direction: 'ascending' | 'descending';
}

function TeamMemberRow({ member }: { member: TeamMember }) {
  const { t } = useTranslation();

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
        <UiBadge
          variant={
            member.status === 'active' ? 'success' :
            member.status === 'pending' ? 'warning' :
            'secondary'
          }
        >
          {t(`teamInsights.statusValues.${member.status}`)}
        </UiBadge>
      </TableCell>
      <TableCell>
        <KycStatusBadge status={member.kycStatus} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          {member.unverifiedPiContribution.toFixed(2)} Pi
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-accent cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('teamInsights.contributionTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="text-right">{member.teamMemberActiveMiningHours_LastWeek ?? 0} hrs</TableCell>
      <TableCell className="text-right">{member.teamMemberActiveMiningHours_LastMonth ?? 0} hrs</TableCell>
    </TableRow>
  );
}

function SortableTableHead({
  children,
  onClick,
  sortKey,
  currentSortKey,
  currentDirection,
  className
}: {
  children: React.ReactNode;
  onClick: () => void;
  sortKey: SortableKeys;
  currentSortKey: SortableKeys | null;
  currentDirection: 'ascending' | 'descending';
  className?: string;
}) {
  const isSorted = currentSortKey === sortKey;
  return (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50", className)} onClick={onClick}>
      <div className="flex items-center gap-2">
        {children}
        {isSorted ? (
          currentDirection === 'ascending' ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-50 text-muted-foreground" />
        )}
      </div>
    </TableHead>
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
          <TableHead>{t('teamInsights.columns.kycStatus')}</TableHead>
          <TableHead className="text-right">{t('teamInsights.columns.contribution')}</TableHead>
          <TableHead className="text-right">{t('teamInsights.columns.activityLastWeek')}</TableHead>
          <TableHead className="text-right">{t('teamInsights.columns.activityLastMonth')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-12" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-12" /></TableCell>
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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'teamMemberActiveMiningHours_LastWeek', direction: 'descending' });

  useEffect(() => {
    async function fetchTeamMembers() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockApiCall({ data: [...mockTeam], failureChance: 0 }); 
        setTeamMembers(data);
      } catch (err) {
        setError(t('teamInsights.error'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeamMembers();
  }, [t]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTeamMembers = useMemo(() => {
    let sortableItems = [...teamMembers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key!];
        const valB = b[sortConfig.key!];

        let comparison = 0;
        if (valA === undefined || valA === null) comparison = -1;
        if (valB === undefined || valB === null) comparison = 1;
        
        if (comparison !== 0 && (valA === undefined || valA === null || valB === undefined || valB === null)) {
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (valA instanceof Date && valB instanceof Date) { 
            comparison = new Date(valA).getTime() - new Date(valB).getTime();
        } else if (typeof valA === 'object' && typeof valB === 'object' && valA !== null && valB !== null && 'getTime' in valA && 'getTime' in valB) { 
            comparison = (valA as Date).getTime() - (valB as Date).getTime();
        } else { 
             const strA = String(valA ?? ''); 
             const strB = String(valB ?? '');
             comparison = strA.localeCompare(strB);
        }
        
        return sortConfig.direction === 'ascending' ? comparison : comparison * -1;
      });
    }
    return sortableItems;
  }, [teamMembers, sortConfig]);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('teamInsights.title')}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            {t('teamInsights.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TeamMembersTableSkeleton />}
          {!isLoading && error && <p className="text-destructive text-center py-8">{error}</p>}
          {!isLoading && !error && sortedTeamMembers.length === 0 && (
            <p className="text-muted-foreground text-center py-8">{t('teamInsights.empty')}</p>
          )}
          {!isLoading && !error && sortedTeamMembers.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    sortKey="name"
                    currentSortKey={sortConfig.key}
                    currentDirection={sortConfig.direction}
                    onClick={() => requestSort('name')}
                  >
                    {t('teamInsights.columns.member')}
                  </SortableTableHead>
                  <SortableTableHead
                     sortKey="joinDate"
                     currentSortKey={sortConfig.key}
                     currentDirection={sortConfig.direction}
                     onClick={() => requestSort('joinDate')}
                  >
                    {t('teamInsights.columns.joinDate')}
                  </SortableTableHead>
                  <SortableTableHead
                     sortKey="status"
                     currentSortKey={sortConfig.key}
                     currentDirection={sortConfig.direction}
                     onClick={() => requestSort('status')}
                  >
                    {t('teamInsights.columns.status')} 
                  </SortableTableHead>
                  <SortableTableHead
                     sortKey="kycStatus"
                     currentSortKey={sortConfig.key}
                     currentDirection={sortConfig.direction}
                     onClick={() => requestSort('kycStatus')}
                  >
                    {t('teamInsights.columns.kycStatus')} 
                  </SortableTableHead>
                  <SortableTableHead
                     sortKey="unverifiedPiContribution"
                     currentSortKey={sortConfig.key}
                     currentDirection={sortConfig.direction}
                     onClick={() => requestSort('unverifiedPiContribution')}
                     className="text-right"
                  >
                    {t('teamInsights.columns.contribution')}
                  </SortableTableHead>
                  <SortableTableHead
                     sortKey="teamMemberActiveMiningHours_LastWeek"
                     currentSortKey={sortConfig.key}
                     currentDirection={sortConfig.direction}
                     onClick={() => requestSort('teamMemberActiveMiningHours_LastWeek')}
                     className="text-right"
                  >
                    {t('teamInsights.columns.activityLastWeek')}
                  </SortableTableHead>
                  <SortableTableHead
                     sortKey="teamMemberActiveMiningHours_LastMonth"
                     currentSortKey={sortConfig.key}
                     currentDirection={sortConfig.direction}
                     onClick={() => requestSort('teamMemberActiveMiningHours_LastMonth')}
                     className="text-right"
                  >
                    {t('teamInsights.columns.activityLastMonth')}
                  </SortableTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeamMembers.map((member) => (
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
