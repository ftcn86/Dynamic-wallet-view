
"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Zap, Percent, CalendarClock, TrendingUp, Settings2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

// These values are simplified approximations for demonstration purposes
// A real calculation would be much more complex and based on the Pi Network formula
const BASE_RATE = 0.0202; // Base mining rate
const TEAM_BONUS = 0.05; // Example team bonus
const NODE_BONUS = 0.1; // Example node bonus

const DURATION_MULTIPLIERS = {
    "2w": 0.1,
    "6m": 0.5,
    "1y": 1,
    "3y": 2
};

const DURATION_LABELS = {
    0: "2 weeks",
    1: "6 months",
    2: "1 year",
    3: "3 years"
};

export function LockupAnalysisCard() {
    const { user } = useAuth();
    const [lockupPercent, setLockupPercent] = useState([50]);
    const [lockupDurationIndex, setLockupDurationIndex] = useState([2]); // Index for DURATION_LABELS

    if (!user) {
        return <Skeleton className="h-96 w-full" />
    }

    const durationKey = Object.keys(DURATION_MULTIPLIERS)[lockupDurationIndex[0]] as keyof typeof DURATION_MULTIPLIERS;
    const durationMultiplier = DURATION_MULTIPLIERS[durationKey];

    // Simplified formula: LockupBonus = LockupPercentage * LockupDurationMultiplier * log(N)
    // where N is number of previous mining sessions. Let's use a constant for log(N) for simplicity.
    const LOG_N_FACTOR = 2.5; 
    const lockupBonus = (lockupPercent[0] / 100) * durationMultiplier * LOG_N_FACTOR;

    const totalMiningRate = BASE_RATE + TEAM_BONUS + (user.isNodeOperator ? NODE_BONUS : 0) + lockupBonus;
    const percentageIncrease = ((totalMiningRate - (BASE_RATE + TEAM_BONUS)) / (BASE_RATE + TEAM_BONUS)) * 100;

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <Settings2 className="mr-2 h-6 w-6 text-primary" />
                    Lockup & Bonus Calculator
                </CardTitle>
                <CardDescription>
                    Adjust your lockup settings to see how it could boost your mining rate. This is an estimate based on a simplified formula.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <Label htmlFor="lockup-percent" className="flex items-center gap-2 font-medium">
                                <Percent className="h-5 w-5 text-accent"/> Lockup Percentage
                            </Label>
                            <Badge variant="secondary" className="text-lg">{lockupPercent[0]}%</Badge>
                        </div>
                        <Slider
                            id="lockup-percent"
                            min={0}
                            max={100}
                            step={10}
                            value={lockupPercent}
                            onValueChange={setLockupPercent}
                        />
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="lockup-duration" className="flex items-center gap-2 font-medium">
                                <CalendarClock className="h-5 w-5 text-accent"/> Lockup Duration
                            </Label>
                            <Badge variant="secondary" className="text-lg">{DURATION_LABELS[lockupDurationIndex[0] as keyof typeof DURATION_LABELS]}</Badge>
                        </div>
                        <Slider
                            id="lockup-duration"
                            min={0}
                            max={3}
                            step={1}
                            value={lockupDurationIndex}
                            onValueChange={setLockupDurationIndex}
                        />
                    </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium text-muted-foreground">Estimated Total Mining Rate</p>
                    <div className="flex items-baseline text-primary my-2">
                        <p className="text-5xl font-bold tracking-tighter">{totalMiningRate.toFixed(4)}</p>
                         <p className="font-medium text-xl ml-1">π/hr</p>
                    </div>
                    <Badge variant="success" className="gap-1.5">
                        <TrendingUp className="h-4 w-4" />
                        ~{percentageIncrease.toFixed(1)}% Increase
                    </Badge>
                </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">
                    Note: The actual mining rate is determined by the official Pi Network formula which includes many factors like the number of your past mining sessions.
                </p>
            </CardFooter>
        </Card>
    )
}
