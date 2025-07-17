
"use client"

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNodeData } from '@/services/piService';
import type { NodeData } from '@/data/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import { PI_NODE_INFO_URL } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { NodeStatusBadge } from '@/components/dashboard/node/NodeStatusBadge';
import { NodeStatCard } from '@/components/dashboard/node/NodeStatCard';

// Solid SVG Icons
const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#22c55e" />
        <path d="m9 12 2 2 4-4" stroke="#fff" strokeWidth="1.5" />
    </svg>
);

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#3b82f6"/>
    </svg>
);

const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="12" cy="8" r="7" fill="#f59e0b"/>
        <polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88" fill="#f59e0b"/>
    </svg>
);

const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="#fff" strokeWidth="2"/>
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="#fff" strokeWidth="2"/>
    </svg>
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);

const GaugeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0" fill="#22c55e"/>
        <path d="m12 12-4 2" stroke="#fff" />
        <path d="M12 14v4" stroke="#fff" />
        <path d="M16 12-2 3" stroke="#fff" />
    </svg>
);

const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="#fff" strokeWidth="1.5"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#fff" strokeWidth="1.5"/>
    </svg>
);

const BlocksIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <rect x="7" y="7" width="10" height="10" rx="2" ry="2"/>
        <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
        <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    </svg>
);

const GitBranchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="6" y1="3" x2="6" y2="15" stroke="hsl(var(--primary))"/>
        <circle cx="18" cy="6" r="3" fill="hsl(var(--primary))" stroke="none"/>
        <circle cx="6" cy="18" r="3" fill="hsl(var(--primary))" stroke="none"/>
        <path d="M18 9a9 9 0 0 1-9 9" stroke="hsl(var(--primary))"/>
    </svg>
);


function NodeOperatorView() {
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNodeData();
        setNodeData(data);
      } catch (err) {
        setError("An error occurred fetching node data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  if (error || !nodeData) return <p className="text-destructive text-center">{error || "Could not load node data."}</p>;

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  };

  const lastSeenText = formatDistanceToNowStrict(parseISO(nodeData.lastSeen), { addSuffix: true });

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <NodeStatCard
                title="Status"
                icon={<ServerIcon />}
                mainContent={<NodeStatusBadge status={nodeData.status}/>}
                footerText={`Last seen: ${lastSeenText}`}
            />
            <NodeStatCard
                title="Location"
                icon={<GlobeIcon />}
                mainContent={<div className="flex items-center gap-2"><span className="text-2xl">{nodeData.countryFlag}</span> {nodeData.country}</div>}
                footerText="Based on your node's IP address"
            />
            <NodeStatCard
                title="Blocks Processed"
                icon={<BlocksIcon />}
                mainContent={nodeData.blocksProcessed.toLocaleString()}
                footerText="Total blocks synchronized"
            />
             <NodeStatCard
                title="Node Version"
                icon={<GitBranchIcon />}
                mainContent={nodeData.nodeSoftwareVersion}
                footerText={`Latest: ${nodeData.latestSoftwareVersion}`}
            />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
            <NodeStatCard
                title="Uptime (30d)"
                icon={<GaugeIcon />}
                mainContent={`${nodeData.uptimePercentage.toFixed(2)}%`}
                footerText="Excellent stability"
            />
            <NodeStatCard
                title="Performance Score"
                icon={<TrendingUpIcon />}
                mainContent={nodeData.performanceScore.toString()}
                footerText="Compared to network average"
            />
        </div>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
          <CardDescription>Your node's performance score trend over the last few months.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={nodeData.performanceHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
               <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <ChartTooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function BecomeANodeOperatorPrompt() {
  return (
    <Card className="shadow-lg text-center max-w-2xl mx-auto">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ServerIcon size={40} />
        </div>
        <CardTitle className="font-headline text-2xl">Become a Node Operator</CardTitle>
        <CardDescription>Help secure the Pi Network and earn rewards by running a node on your computer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left space-y-4">
            <h3 className="font-semibold text-center">Why Run a Node?</h3>
            <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 mt-1 shrink-0">
                    <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">Strengthen the Network</h4>
                    <p className="text-sm text-muted-foreground">Each node contributes to the decentralization and security of the Pi blockchain.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10 mt-1 shrink-0">
                    <AwardIcon className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">Earn Pi Rewards</h4>
                    <p className="text-sm text-muted-foreground">Receive additional Pi for your contribution to the network's operation.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 mt-1 shrink-0">
                    <ZapIcon className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">Prepare for Mainnet</h4>
                    <p className="text-sm text-muted-foreground">Play a crucial role in validating transactions when the Open Network period begins.</p>
                </div>
            </div>
        </div>
      </CardContent>
       <CardFooter className="flex-col gap-4">
         <Button asChild size="lg" className="w-full sm:w-auto">
          <a href={PI_NODE_INFO_URL} target="_blank" rel="noopener noreferrer">
            Learn More on Pi Network
            <ExternalLinkIcon className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <p className="text-xs text-muted-foreground">Node software runs on desktop or laptop computers.</p>
       </CardFooter>
    </Card>
  );
}


export default function NodeAnalysisPage() {
  const { user } = useAuth();

  if (!user) return <div className="flex h-full w-full items-center justify-center"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Node Analysis</h1>
      {user.isNodeOperator ? <NodeOperatorView /> : <BecomeANodeOperatorPrompt />}
    </div>
  );
}
