
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTeamMembers } from '@/services/piService';
import type { TeamMember } from '@/data/schemas';
import { format } from 'date-fns';
import { Info, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { KycStatusBadge } from '@/components/shared/KycStatusBadge'; 
import { Badge as UiBadge } from '@/components/ui/badge';
import { SortableTableHead, type SortConfig } from '@/components/shared/SortableTableHead';

type SortableKeys = keyof Pick<TeamMember, 'name' | 'joinDate' | 'status' | 'unverifiedPiContribution' | 'teamMemberActiveMiningHours_LastWeek' | 'kycStatus'>;

const statusVariantMap = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
} as const;

function TeamMemberRow({ member }: { member: TeamMember }) {
  const avatarFallback = member.name ? member.name.charAt(0).toUpperCase() : '?';
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person face" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{member.name}</span>
        </div>
      </TableCell>
      <TableCell>{format(new Date(member.joinDate), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <UiBadge
          variant={statusVariantMap[member.status]}
          className="capitalize"
        >
          {member.status}
        </UiBadge>
      </TableCell>
      <TableCell>
        <KycStatusBadge status={member.kycStatus} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 font-mono">
          {member.unverifiedPiContribution.toFixed(2)} π
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Unverified Pi contributed by this team member.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono">{member.teamMemberActiveMiningHours_LastWeek ?? 0} hrs</TableCell>
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig<TeamMember>>({ key: 'teamMemberActiveMiningHours_LastWeek', direction: 'descending' });

  useEffect(() => {
    async function fetchTeamMembers() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTeamMembers();
        setTeamMembers(data);
      } catch (err) {
        setError("Failed to load team members. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeamMembers();
  }, []);

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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Security & Team Insights</h1>
        <p className="text-muted-foreground max-w-3xl">
          Your Security Circle is a group of 3-5 trusted people you build from your broader Earning Team. While your full Earning Team increases your mining rate, your Security Circle provides a significant boost and is crucial for the security of the network. This table displays all members of your Earning Team.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Your Earning Team
          </CardTitle>
          <CardDescription>
            Manage and view insights about your team members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <TeamMembersTableSkeleton />}
          {!isLoading && error && <p className="text-destructive text-center py-8">{error}</p>}
          {!isLoading && !error && sortedTeamMembers.length === 0 && (
            <p className="text-muted-foreground text-center py-8">You have not invited any team members yet.</p>
          )}
          {!isLoading && !error && sortedTeamMembers.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableTableHead<TeamMember> sortKey="name" sortConfig={sortConfig} onClick={() => requestSort('name')}>
                      Member
                    </SortableTableHead>
                    <SortableTableHead<TeamMember> sortKey="joinDate" sortConfig={sortConfig} onClick={() => requestSort('joinDate')}>
                      Join Date
                    </SortableTableHead>
                    <SortableTableHead<TeamMember> sortKey="status" sortConfig={sortConfig} onClick={() => requestSort('status')}>
                      Status
                    </SortableTableHead>
                    <SortableTableHead<TeamMember> sortKey="kycStatus" sortConfig={sortConfig} onClick={() => requestSort('kycStatus')}>
                      KYC Status
                    </SortableTableHead>
                    <SortableTableHead<TeamMember> sortKey="unverifiedPiContribution" sortConfig={sortConfig} onClick={() => requestSort('unverifiedPiContribution')} isNumeric={true}>
                      Contribution
                    </SortableTableHead>
                    <SortableTableHead<TeamMember> sortKey="teamMemberActiveMiningHours_LastWeek" sortConfig={sortConfig} onClick={() => requestSort('teamMemberActiveMiningHours_LastWeek')} isNumeric={true}>
                      Activity (wk)
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
