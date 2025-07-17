
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Legend } from 'recharts';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockChartData } from '@/data/mocks';
import { format } from 'date-fns';
import { BarChart2 } from 'lucide-react';

type ChartPeriod = '3M' | '6M' | '12M';

export function BalanceFluctuationChartCard() {
  const [period, setPeriod] = useState<ChartPeriod>('6M');
  const data = mockChartData[period];

  const chartConfig = {
    transferable: {
      label: "Transferable",
      color: "hsl(var(--primary))",
    },
    unverified: {
      label: "Unverified",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline flex items-center">
                    <BarChart2 className="mr-2 h-6 w-6 text-primary" />
                    Balance Fluctuation
                </CardTitle>
                <CardDescription>
                    Track your balance changes over time.
                </CardDescription>
            </div>
            <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as ChartPeriod)} className="w-auto">
                <TabsList>
                    <TabsTrigger value="3M">3M</TabsTrigger>
                    <TabsTrigger value="6M">6M</TabsTrigger>
                    <TabsTrigger value="12M">12M</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <RechartsBarChart 
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            barGap={4}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), 'MMM yy')}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              label={{ value: "Pi Amount", angle: -90, position: 'insideLeft', offset: -10 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="transferable" fill="var(--color-transferable)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="unverified" fill="var(--color-unverified)" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
