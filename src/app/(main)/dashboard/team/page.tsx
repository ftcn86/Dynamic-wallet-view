
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTeamMembers, sendBroadcastNotification, addNotification } from '@/services/piService';
import type { TeamMember } from '@/data/schemas';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { KycStatusBadge } from '@/components/shared/KycStatusBadge'; 
import { Badge as UiBadge } from '@/components/ui/badge';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useTranslation } from '@/hooks/useTranslation';
import { 
    UsersIcon, 
    BellIconAccent as BellIcon, 
    MessageSquareIconAccent as MessageSquareIcon, 
    SendIcon, 
    InfoIcon 
} from '@/components/shared/icons';

function TeamManagementCard({ teamMembers }: { teamMembers: TeamMember[] }) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [isPinging, setIsPinging] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const inactiveMembersCount = useMemo(() => teamMembers.filter(m => m.status === 'inactive').length, [teamMembers]);

    const handlePingInactive = () => {
        setIsPinging(true);
        setTimeout(() => {
            toast({
                title: t('teamInsights.pingSuccessTitle'),
                description: t('teamInsights.pingSuccessDesc', { count: inactiveMembersCount }),
            });
            setIsPinging(false);
        }, 1000);
    };

    const handleBroadcast = async () => {
        if (!broadcastMessage.trim()) {
            toast({ title: t('teamInsights.broadcastEmptyTitle'), variant: "destructive" });
            return;
        }
        setIsBroadcasting(true);
        try {
            // Send broadcast and create notification
            const result = await sendBroadcastNotification(broadcastMessage);
            
            if (result.success) {
                // Also create a notification for the current user
                await addNotification({
                    type: 'team_message',
                    title: 'Message from your Team Leader',
                    description: broadcastMessage,
                    link: '/dashboard/team'
                });
                
                toast({
                    title: t('teamInsights.broadcastSuccessTitle'),
                    description: t('teamInsights.broadcastSuccessDesc'),
                });
                setBroadcastMessage("");
            } else {
                throw new Error('Failed to send broadcast');
            }
        } catch (error) {
             toast({
                title: t('teamInsights.broadcastErrorTitle'),
                description: t('teamInsights.broadcastErrorDesc'),
                variant: 'destructive'
            });
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl"><UsersIcon className="h-5 w-5 sm:h-6 sm:w-6"/> {t('teamInsights.managementTools.title')}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{t('teamInsights.managementTools.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col space-y-4 rounded-lg border p-3 sm:p-4">
                    <div className="flex items-center gap-2 font-medium">
                        <BellIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                        <h3 className="text-sm sm:text-base">{t('teamInsights.managementTools.pingInactive.title')}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground flex-grow">
                        {t('teamInsights.managementTools.pingInactive.description', {count: inactiveMembersCount})}
                    </p>
                    <Button onClick={handlePingInactive} disabled={isPinging || inactiveMembersCount === 0} className="text-xs sm:text-sm">
                        {isPinging ? <LoadingSpinner className="mr-2 h-3 w-3 sm:h-4 sm:w-4"/> : <BellIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4"/>}
                        {isPinging ? t('teamInsights.managementTools.pingInactive.buttonPinging') : t('teamInsights.managementTools.pingInactive.button', {count: inactiveMembersCount})}
                    </Button>
                </div>
                <div className="flex flex-col space-y-4 rounded-lg border p-3 sm:p-4">
                     <div className="flex items-center gap-2 font-medium">
                        <MessageSquareIcon className="h-4 w-4 sm:h-5 sm:w-5"/>
                        <h3 className="text-sm sm:text-base">{t('teamInsights.managementTools.broadcast.title')}</h3>
                    </div>
                    <Textarea 
                        placeholder={t('teamInsights.managementTools.broadcast.placeholder')}
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="flex-grow text-xs sm:text-sm"
                        disabled={isBroadcasting}
                    />
                    <Button onClick={handleBroadcast} disabled={isBroadcasting || !broadcastMessage.trim()} className="text-xs sm:text-sm">
                       {isBroadcasting ? <LoadingSpinner className="mr-2 h-3 w-3 sm:h-4 sm:w-4"/> : <SendIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4"/>}
                       {isBroadcasting ? t('teamInsights.managementTools.broadcast.buttonSending') : t('teamInsights.managementTools.broadcast.button')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

const statusVariantMap = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
} as const;

function TeamMemberRow({ member }: { member: TeamMember }) {
  const { t } = useTranslation();
  const avatarFallback = member.name ? member.name.charAt(0).toUpperCase() : '?';
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.dataAiHint} />
            <AvatarFallback className="text-xs sm:text-sm">{avatarFallback}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm sm:text-base">{member.name}</span>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-sm">{format(new Date(member.joinDate), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <UiBadge
          variant={statusVariantMap[member.status]}
          className="capitalize text-xs sm:text-sm"
        >
          {t(`teamInsights.statusValues.${member.status}`)}
        </UiBadge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <KycStatusBadge status={member.kycStatus} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 font-mono">
          <span className="text-xs sm:text-sm">{member.unverifiedPiContribution.toFixed(2)} π</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3 w-3 sm:h-4 sm:w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('teamInsights.contributionTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono text-xs sm:text-sm">{member.teamMemberActiveMiningHours_LastWeek ?? 0} {t('dashboard.teamActivity.hoursSuffix')}</TableCell>
    </TableRow>
  );
}

function TeamMembersTableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  );
}

export default function TeamInsightsPage() {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<React.SortConfig<TeamMember>>({ key: 'teamMemberActiveMiningHours_LastWeek', direction: 'descending' });

  useEffect(() => {
    async function fetchTeamMembers() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTeamMembers();
        setTeamMembers(data);
      } catch (err) {
        setError(t('teamInsights.error'));
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeamMembers();
  }, [t]);

  const requestSort = (key: keyof TeamMember) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTeamMembers = useMemo(() => {
    const sortableItems = [...teamMembers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key! as keyof TeamMember];
        const valB = b[sortConfig.key! as keyof TeamMember];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        
        let comparison = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
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
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">{t('teamInsights.title')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
          {t('teamInsights.description')}
        </p>
      </div>

      <TeamManagementCard teamMembers={teamMembers} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <UsersIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            {t('teamInsights.tableTitle')}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t('teamInsights.tableDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <TeamMembersTableSkeleton />}
          {!isLoading && error && <p className="text-destructive text-center py-8">{error}</p>}
          {!isLoading && !error && sortedTeamMembers.length === 0 && (
            <p className="text-muted-foreground text-center py-8">{t('teamInsights.empty')}</p>
          )}
          {!isLoading && !error && sortedTeamMembers.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead sortKey="name" sortConfig={sortConfig} onClick={() => requestSort('name')}>
                      {t('teamInsights.columns.member')}
                    </SortableTableHead>
                    <SortableTableHead sortKey="joinDate" sortConfig={sortConfig} onClick={() => requestSort('joinDate')} className="hidden lg:table-cell">
                      {t('teamInsights.columns.joinDate')}
                    </SortableTableHead>
                    <SortableTableHead sortKey="status" sortConfig={sortConfig} onClick={() => requestSort('status')}>
                      {t('teamInsights.columns.status')}
                    </SortableTableHead>
                    <SortableTableHead sortKey="kycStatus" sortConfig={sortConfig} onClick={() => requestSort('kycStatus')} className="hidden md:table-cell">
                      {t('teamInsights.columns.kycStatus')}
                    </SortableTableHead>
                    <SortableTableHead sortKey="unverifiedPiContribution" sortConfig={sortConfig} onClick={() => requestSort('unverifiedPiContribution')} isNumeric={true}>
                      {t('teamInsights.columns.contribution')}
                    </SortableTableHead>
                    <SortableTableHead sortKey="teamMemberActiveMiningHours_LastWeek" sortConfig={sortConfig} onClick={() => requestSort('teamMemberActiveMiningHours_LastWeek')} isNumeric={true}>
                      {t('teamInsights.columns.activityLastWeek')}
                    </SortableTableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeamMembers.map((member) => (
                    <TeamMemberRow key={member.id} member={member} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
