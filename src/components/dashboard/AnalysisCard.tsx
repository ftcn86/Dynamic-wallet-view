

"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { mockApiCall } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ForecastCard } from './ForecastCard';
import {
    ZapIcon,
    PercentIcon,
    CalendarClockIcon,
    TrendingUpIcon,
    SettingsIcon,
    InfoIcon,
} from '@/components/shared/icons';

const WandSparkles = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="hsl(var(--primary))" {...props}>
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" fill="#fff" />
  </svg>
);


const DURATION_MULTIPLIERS = { "2w": 0.1, "6m": 0.5, "1y": 1, "3y": 2 };
const DURATION_LABELS = { 0: "2 weeks", 1: "6 months", 2: "1 year", 3: "3 years" };

function Disclaimer() {
    return (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            <InfoIcon className="h-5 w-5 shrink-0 mt-0.5" />
            <p>
                The results from these calculators are for informational and educational purposes only. They are estimates based on simplified formulas and do not represent guaranteed future earnings.
            </p>
        </div>
    );
}

// Simplified calculation logic for the frontend
const calculateEstimatedRate = (baseRate: number, teamBonus: number, nodeBonus: number, lockupPercent: number, durationIndex: number, isNodeOperator: boolean) => {
    const durationKey = Object.keys(DURATION_MULTIPLIERS)[durationIndex] as keyof typeof DURATION_MULTIPLIERS;
    const durationMultiplier = DURATION_MULTIPLIERS[durationKey];
    const LOG_N_FACTOR = 2.5; 
    const lockupBonus = (lockupPercent / 100) * durationMultiplier * LOG_N_FACTOR;
    const totalMiningRate = baseRate + teamBonus + (isNodeOperator ? nodeBonus : 0) + lockupBonus;
    return totalMiningRate;
};

function LockupCalculator() {
    const { user } = useAuth();
    const [lockupPercent, setLockupPercent] = useState([50]);
    const [lockupDurationIndex, setLockupDurationIndex] = useState([2]); 
    const [estimatedRate, setEstimatedRate] = useState<number | null>(null);
    const [isCalculatingRate, setIsCalculatingRate] = useState(false);

    useEffect(() => {
        if (user) {
            handleCalculateRate(lockupPercent[0], lockupDurationIndex[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleCalculateRate = async (percent: number, durationIdx: number) => {
        if (!user) return;
        setIsCalculatingRate(true);
        try {
            const result = await mockApiCall({
                data: { newRate: calculateEstimatedRate(0.0202, 0.05, 0.1, percent, durationIdx, user.isNodeOperator) }
            });
            setEstimatedRate(result.newRate);
        } catch (error) {
            console.error("Failed to calculate rate:", error);
        } finally {
            setIsCalculatingRate(false);
        }
    };

    const onCalculateClick = () => {
        handleCalculateRate(lockupPercent[0], lockupDurationIndex[0]);
    }
    
    if (!user) return <Skeleton className="h-[400px] w-full" />;

    const percentageIncrease = estimatedRate && user.miningRate ? ((estimatedRate - user.miningRate) / user.miningRate) * 100 : 0;
    
    return (
        <CardFooter className="flex-col items-stretch p-0">
            <div className="space-y-4 p-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="flex items-center gap-2 font-medium"><PercentIcon className="h-5 w-5"/> Lockup Percentage</Label>
                                <Badge variant="secondary" className="text-md">{lockupPercent[0]}%</Badge>
                            </div>
                            <Slider min={0} max={100} step={10} value={lockupPercent} onValueChange={setLockupPercent} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <Label className="flex items-center gap-2 font-medium"><CalendarClockIcon className="h-5 w-5"/> Lockup Duration</Label>
                                <Badge variant="secondary" className="text-md">{DURATION_LABELS[lockupDurationIndex[0] as keyof typeof DURATION_LABELS]}</Badge>
                            </div>
                            <Slider min={0} max={3} step={1} value={lockupDurationIndex} onValueChange={setLockupDurationIndex} />
                        </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex flex-col items-center justify-center text-center min-h-[140px]">
                        {isCalculatingRate ? (
                            <LoadingSpinner size={32} />
                        ) : estimatedRate !== null ? (
                            <>
                                <p className="text-sm font-medium text-muted-foreground">Estimated Total Mining Rate</p>
                                <div className="flex items-baseline text-primary my-1">
                                    <p className="text-4xl font-bold tracking-tighter">{estimatedRate.toFixed(4)}</p>
                                    <p className="font-medium text-lg ml-1">π/hr</p>
                                </div>
                                <Badge variant="success" className="gap-1.5"><TrendingUpIcon className="h-4 w-4" />~{percentageIncrease.toFixed(1)}% Increase</Badge>
                            </>
                        ) : (
                            <p className="text-muted-foreground">Click calculate to see estimate.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="bg-muted px-6 py-4 border-t">
                <Button className="w-full" onClick={onCalculateClick} disabled={isCalculatingRate}>
                   {isCalculatingRate && <LoadingSpinner className="mr-2 h-4 w-4" />}
                   {isCalculatingRate ? 'Calculating...' : 'Calculate Mining Rate Boost'}
                </Button>
            </div>
            <div className="p-6 pt-4">
                <Disclaimer />
            </div>
        </CardFooter>
    );
}

export function AnalysisCard() {
    const { user } = useAuth();
    
    if (!user) {
        return <Skeleton className="h-[500px] w-full" />
    }

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <SettingsIcon className="mr-2 h-6 w-6" />
                    Scenario Analysis & Forecasting
                </CardTitle>
                <CardDescription>
                    Use these tools to estimate potential outcomes based on different scenarios. All calculations are illustrative.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="calculator" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="calculator"><ZapIcon className="mr-2 h-4 w-4" />Calculator</TabsTrigger>
                        <TabsTrigger value="forecast"><WandSparkles className="mr-2 h-4 w-4" />AI Forecast</TabsTrigger>
                    </TabsList>
                    <TabsContent value="calculator">
                        <LockupCalculator />
                    </TabsContent>
                    <TabsContent value="forecast">
                        <ForecastCard />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
