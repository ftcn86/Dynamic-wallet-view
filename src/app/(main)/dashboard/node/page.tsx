
"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getNodeData } from '@/services/piService';
import type { NodeData } from '@/data/schemas';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Server, ExternalLink, ShieldCheck, Zap, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart as RechartsLineChart, XAxis, YAxis, Legend, Line, Area, AreaChart } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { format } from 'date-fns';
import { PI_NODE_INFO_URL } from '@/lib/constants';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


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
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <KPICard
          title="Node Uptime (30d)"
          value={`${nodeData.uptimePercentage.toFixed(2)}%`}
          icon={<Server />}
          footerValue="Excellent stability"
          badgeText="Healthy"
          badgeVariant="success"
        />
        <KPICard
          title="Performance Score"
          value={nodeData.performanceScore.toString()}
          icon={<TrendingUp />}
          footerValue="Compared to network average"
          change="+5.2%"
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
              <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM yy')} tickLine={false} axisLine={false} />
              <YAxis label={{ value: "Score", angle: -90, position: 'insideLeft', offset: 0 }} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
              <Legend />
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
          <Server size={40} className="text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Become a Node Operator</CardTitle>
        <CardDescription>Help secure the Pi Network and earn rewards by running a node on your computer.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-left space-y-4">
            <h3 className="font-semibold text-center">Why Run a Node?</h3>
            <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-600 mt-1">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">Strengthen the Network</h4>
                    <p className="text-sm text-muted-foreground">Each node contributes to the decentralization and security of the Pi blockchain.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600 mt-1">
                    <Award className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">Earn Pi Rewards</h4>
                    <p className="text-sm text-muted-foreground">Receive additional Pi for your contribution to the network's operation.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 mt-1">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-medium">Prepare for Mainnet</h4>
                    <p className="text-sm text-muted-foreground">Play a crucial role in validating transactions when the Open Network period begins.</p>
                </div>
            </div>
        </div>
         <Button asChild size="lg" className="w-full sm:w-auto">
          <a href={PI_NODE_INFO_URL} target="_blank" rel="noopener noreferrer">
            Learn More on Pi Network
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
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
