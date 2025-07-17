
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { mockApiCall } from '@/lib/api';

// Solid SVG Icons
const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);

const PercentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="19" y1="5" x2="5" y2="19" stroke="hsl(var(--accent))" />
        <circle cx="6.5" cy="6.5" r="2.5" fill="hsl(var(--accent))" />
        <circle cx="17.5" cy="17.5" r="2.5" fill="hsl(var(--accent))" />
    </svg>
);

const CalendarClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--accent))" {...props}>
        <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="#fff" strokeWidth="2" />
        <circle cx="18" cy="18" r="4" fill="#fff" stroke="#60A5FA" strokeWidth="2" />
        <path d="m18 16-2 2" stroke="#60A5FA" strokeWidth="2" />
    </svg>
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);

const Settings2Icon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M20 7h-9" stroke="#fff" strokeWidth="2" />
        <path d="M4 7h2" stroke="#fff" strokeWidth="2" />
        <path d="M4 17h9" stroke="#fff" strokeWidth="2" />
        <path d="M17 17h3" stroke="#fff" strokeWidth="2" />
        <circle cx="8" cy="7" r="2" fill="#fff" stroke="hsl(var(--primary))" strokeWidth="2" />
        <circle cx="15" cy="17" r="2" fill="#fff" stroke="hsl(var(--primary))" strokeWidth="2" />
    </svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f59e0b" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" stroke="#fff" strokeWidth="2" />
        <line x1="12" y1="8" x2="12.01" y2="8" stroke="#fff" strokeWidth="2" />
    </svg>
);

const PiggyBankIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--primary))" {...props}>
        <path d="M10 20.5c0 .83.67 1.5 1.5 1.5h1c.83 0 1.5-.67 1.5-1.5v-2.5h-4v2.5z"/>
        <path d="M21.5 12.5c0-2.49-2.01-4.5-4.5-4.5h-1v-2c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v2h-1c-2.49 0-4.5 2.01-4.5 4.5v0c0 1.68 1.05 3.1 2.5 3.82V18c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1.68c1.45-.72 2.5-2.14 2.5-3.82z"/>
        <path d="M15 10.5c0-.83-.67-1.5-1.5-1.5h-.01c-.82 0-1.49.67-1.49 1.5v.51h3v-.51z" fill="#fff"/>
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

const DURATION_MULTIPLIERS = { "2w": 0.1, "6m": 0.5, "1y": 1, "3y": 2 };
const DURATION_LABELS = { 0: "2 weeks", 1: "6 months", 2: "1 year", 3: "3 years" };
const FUTURE_DURATION_LABELS = { 0: "3 months", 1: "6 months", 2: "1 year", 3: "3 years" };
const FUTURE_DURATION_MONTHS = { 0: 3, 1: 6, 2: 12, 3: 36 };

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

export function AnalysisCard() {
    const { user } = useAuth();
    
    // State for Lockup Calculator
    const [lockupPercent, setLockupPercent] = useState([50]);
    const [lockupDurationIndex, setLockupDurationIndex] = useState([2]); 
    const [estimatedRate, setEstimatedRate] = useState<number | null>(null);
    const [isCalculatingRate, setIsCalculatingRate] = useState(false);

    // Initial calculation on mount
    useEffect(() => {
        if (user) {
            const initialRate = calculateEstimatedRate(0.0202, 0.05, 0.1, lockupPercent[0], lockupDurationIndex[0], user.isNodeOperator);
            setEstimatedRate(initialRate);
        }
    }, [user, lockupPercent, lockupDurationIndex]);

    const handleCalculateRate = async () => {
        if (!user) return;
        setIsCalculatingRate(true);
        try {
            // In a real app, this would call the backend:
            // const result = await postToMiningRateCalculator({
            //   lockupPercentage: lockupPercent[0],
            //   lockupDuration: Object.keys(DURATION_MULTIPLIERS)[lockupDurationIndex[0]]
            // });
            // For now, we simulate the call and use our local calculation
            const result = await mockApiCall({
                data: { newRate: calculateEstimatedRate(0.0202, 0.05, 0.1, lockupPercent[0], lockupDurationIndex[0], user.isNodeOperator) }
            });
            setEstimatedRate(result.newRate);
        } catch (error) {
            console.error("Failed to calculate rate:", error);
            // Handle error state if needed
        } finally {
            setIsCalculatingRate(false);
        }
    };
    
    if (!user) {
        return <Skeleton className="h-[500px] w-full" />
    }

    const percentageIncrease = estimatedRate && user.miningRate ? ((estimatedRate - user.miningRate) / user.miningRate) * 100 : 0;
    
    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <Settings2Icon className="mr-2 h-6 w-6" />
                    Scenario Analysis & Forecasting
                </CardTitle>
                <CardDescription>
                    Use these tools to estimate potential outcomes based on different scenarios. All calculations are illustrative.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Lockup & Bonus Calculator */}
                <CardFooter className="flex-col items-stretch p-0">
                    <div className="space-y-4 p-6">
                        <h3 className="font-semibold text-lg flex items-center"><ZapIcon className="mr-2 h-5 w-5"/>Lockup & Bonus Calculator</h3>
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
                        <Button className="w-full" onClick={handleCalculateRate} disabled={isCalculatingRate}>
                           {isCalculatingRate && <LoadingSpinner className="mr-2 h-4 w-4" />}
                           {isCalculatingRate ? 'Calculating...' : 'Calculate Mining Rate Boost'}
                        </Button>
                    </div>
                    <div className="p-6 pt-4">
                        <Disclaimer />
                    </div>
                </CardFooter>
            </CardContent>
        </Card>
    );
}
