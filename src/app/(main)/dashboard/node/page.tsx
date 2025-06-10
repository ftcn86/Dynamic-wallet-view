
"use client"

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { mockApiCall } from '@/lib/api';
import { mockNodeData } from '@/data/mocks';
import type { NodeData } from '@/data/schemas';
import { KPICard } from '@/components/shared/KPICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Server, ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Line } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { format } from 'date-fns';
import { PI_NODE_INFO_URL } from '@/lib/constants';


function NodeOperatorView() {
  const { t } = useTranslation();
  const [nodeData, setNodeData] = useState<NodeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockApiCall({ data: mockNodeData });
        setNodeData(data);
      } catch (err) {
        setError(t('shared.error')); 
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [t]); 

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

  if (error) return null; 
  if (!nodeData) return null;

  const chartConfig = {
    score: {
      label: t('nodeAnalysis.isOperator.yAxisLabel'),
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <KPICard
          title={t('nodeAnalysis.isOperator.uptime')}
          value={`${nodeData.uptimePercentage.toFixed(2)}%`}
          icon={<Server className="h-5 w-5 text-primary" />}
        />
        <KPICard
          title={t('nodeAnalysis.isOperator.performanceScore')}
          value={nodeData.performanceScore.toString()}
          icon={<TrendingUp className="h-5 w-5 text-accent" />}
        />
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('nodeAnalysis.isOperator.performanceHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsLineChart data={nodeData.performanceHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM yy')} />
              <YAxis label={{ value: t('nodeAnalysis.isOperator.yAxisLabel'), angle: -90, position: 'insideLeft' }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function BecomeANodeOperatorPrompt() {
  const { t } = useTranslation();
  return (
    <Card className="shadow-lg text-center max-w-lg mx-auto">
      <CardHeader>
        <div className="mx-auto mb-4">
          <Server size={48} className="text-primary" />
        </div>
        <CardTitle className="font-headline">{t('nodeAnalysis.isNotOperator.title')}</CardTitle>
        <CardDescription>{t('nodeAnalysis.isNotOperator.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild size="lg">
          <a href={PI_NODE_INFO_URL} target="_blank" rel="noopener noreferrer">
            {t('nodeAnalysis.isNotOperator.button')}
            <ExternalLink className="ml-2 h-4 w-4 text-primary-foreground" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}


export default function NodeAnalysisPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return <p>{t('shared.loading')}</p>; 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('nodeAnalysis.title')}</h1>
      {user.isNodeOperator ? <NodeOperatorView /> : <BecomeANodeOperatorPrompt />}
    </div>
  );
}
