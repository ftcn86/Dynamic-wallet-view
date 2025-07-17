
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getTeamMembers, sendBroadcastNotification } from '@/services/piService';
import type { TeamMember } from '@/data/schemas';
import { format } from 'date-fns';
import { Info, Users, Bell, MessageSquare, Send } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { KycStatusBadge } from '@/components/shared/KycStatusBadge'; 
import { Badge as UiBadge } from '@/components/ui/badge';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

function TeamManagementCard({ teamMembers }: { teamMembers: TeamMember[] }) {
    const { toast } = useToast();
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [isPinging, setIsPinging] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const inactiveMembersCount = useMemo(() => teamMembers.filter(m => m.status === 'inactive').length, [teamMembers]);

    const handlePingInactive = () => {
        setIsPinging(true);
        setTimeout(() => {
            toast({
                title: "Inactive Members Pinged",
                description: `A reminder notification has been sent to ${inactiveMembersCount} inactive members.`,
            });
            setIsPinging(false);
        }, 1000);
    };

    const handleBroadcast = async () => {
        if (!broadcastMessage.trim()) {
            toast({ title: "Message is empty", variant: "destructive" });
            return;
        }
        setIsBroadcasting(true);
        try {
            await sendBroadcastNotification(broadcastMessage);
            toast({
                title: "Broadcast Sent",
                description: "Your message has been sent to all team members as a notification.",
            });
            setBroadcastMessage("");
        } catch (error) {
             toast({
                title: "Broadcast Failed",
                description: "Could not send the broadcast. Please try again.",
                variant: 'destructive'
            });
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6 text-primary"/> Team Management Tools</CardTitle>
                <CardDescription>Engage with your team to boost overall activity and cooperation.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4 rounded-lg border p-4">
                    <div className="flex items-center gap-2 font-medium">
                        <Bell className="h-5 w-5 text-accent"/>
                        <h3>Ping Inactive Members</h3>
                    </div>
                    <p className="text-sm text-muted-foreground flex-grow">
                        Gently remind your {inactiveMembersCount} inactive team member(s) to start their mining session.
                    </p>
                    <Button onClick={handlePingInactive} disabled={isPinging || inactiveMembersCount === 0}>
                        {isPinging ? <LoadingSpinner className="mr-2"/> : <Bell className="mr-2 h-4 w-4"/>}
                        {isPinging ? "Pinging..." : `Ping ${inactiveMembersCount} Members`}
                    </Button>
                </div>
                <div className="flex flex-col space-y-4 rounded-lg border p-4">
                     <div className="flex items-center gap-2 font-medium">
                        <MessageSquare className="h-5 w-5 text-accent"/>
                        <h3>Send a Broadcast</h3>
                    </div>
                    <Textarea 
                        placeholder="Type your message to the team..."
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        className="flex-grow"
                        disabled={isBroadcasting}
                    />
                    <Button onClick={handleBroadcast} disabled={isBroadcasting || !broadcastMessage.trim()}>
                       {isBroadcasting ? <LoadingSpinner className="mr-2"/> : <Send className="mr-2 h-4 w-4"/>}
                       {isBroadcasting ? "Sending..." : "Send Broadcast"}
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
      <TableCell className="hidden lg:table-cell">{format(new Date(member.joinDate), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <UiBadge
          variant={statusVariantMap[member.status]}
          className="capitalize"
        >
          {member.status}
        </UiBadge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
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
  const [sortConfig, setSortConfig] = useState<React.SortConfig<TeamMember>>({ key: 'teamMemberActiveMiningHours_LastWeek', direction: 'descending' });

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

  const requestSort = (key: keyof TeamMember) => {
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
          Engage with your team, monitor their activity, and understand the importance of your Security Circle—a group of 3-5 trusted people from your Earning Team who boost your mining rate and network security.
        </p>
      </div>

      <TeamManagementCard teamMembers={teamMembers} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Your Earning Team
          </CardTitle>
          <CardDescription>
            View insights about your team members. Members marked inactive can be pinged using the tools above.
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
                    <SortableTableHead sortKey="name" sortConfig={sortConfig} onClick={() => requestSort('name')}>
                      Member
                    </SortableTableHead>
                    <SortableTableHead sortKey="joinDate" sortConfig={sortConfig} onClick={() => requestSort('joinDate')} className="hidden lg:table-cell">
                      Join Date
                    </SortableTableHead>
                    <SortableTableHead sortKey="status" sortConfig={sortConfig} onClick={() => requestSort('status')}>
                      Status
                    </SortableTableHead>
                    <SortableTableHead sortKey="kycStatus" sortConfig={sortConfig} onClick={() => requestSort('kycStatus')} className="hidden md:table-cell">
                      KYC Status
                    </SortableTableHead>
                    <SortableTableHead sortKey="unverifiedPiContribution" sortConfig={sortConfig} onClick={() => requestSort('unverifiedPiContribution')} isNumeric={true}>
                      Contribution
                    </SortableTableHead>
                    <SortableTableHead sortKey="teamMemberActiveMiningHours_LastWeek" sortConfig={sortConfig} onClick={() => requestSort('teamMemberActiveMiningHours_LastWeek')} isNumeric={true}>
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
