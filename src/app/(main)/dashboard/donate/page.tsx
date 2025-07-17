
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Send, Sparkles, Rocket, Server, Paintbrush } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const presetAmounts = ["1", "5", "10", "20"];
const MOCK_GOAL = 250;
const MOCK_CURRENT_DONATIONS = 185;

const mockSupporters = [
  "Pioneer123", "PiExplorer", "AlexP", "CharlieNode", "FutureOfPi", "Miner4Life"
];

const mockRecentDonations = [
  { name: 'Pioneer123', amount: 5 },
  { name: 'CryptoCat', amount: 10 },
  { name: 'AlexP', amount: 1 },
  { name: 'NodeRunner', amount: 20 },
  { name: 'PiFuture', amount: 5 },
];

function RecentSupporters() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % mockRecentDonations.length);
        }, 3000); // Change supporter every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const donation = mockRecentDonations[index];

    return (
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 h-14 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={donation.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center text-sm"
            >
                <Sparkles className="h-5 w-5 text-amber-500 mr-3" />
                <p className="font-semibold text-primary">{donation.name}</p>
                <p className="text-muted-foreground ml-1.5"> just supported with {donation.amount}π!</p>
            </motion.div>
        </AnimatePresence>
      </div>
    );
}


export default function DonatePage() {
  const [amount, setAmount] = useState("5");
  const [isCustom, setIsCustom] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const { toast } = useToast();

  const handlePresetSelect = (presetAmount: string) => {
    setAmount(presetAmount);
    setIsCustom(false);
  }

  const handleCustomSelect = () => {
    setIsCustom(true);
    setAmount("");
  }

  const handleDonate = () => {
    setIsDonating(true);
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
            toast({
                title: "Thank you for your support!",
                description: `Your donation of ${amount} π is greatly appreciated.`,
            });
        } else {
            toast({
                title: "Donation Failed",
                description: "There was an issue processing your donation. Please try again.",
                variant: "destructive",
            });
        }
        setIsDonating(false);
    }, 1500);
  };

  const donationProgress = (MOCK_CURRENT_DONATIONS / MOCK_GOAL) * 100;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Support Our Project</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="shadow-lg border-primary/20 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 mb-4">
                    <Heart className="h-8 w-8 text-pink-500" />
                </div>
                <CardTitle className="text-2xl font-headline">Join Us in Building the Future</CardTitle>
                <CardDescription className="max-w-md">
                    Your contributions are vital for maintaining and enhancing this app for the entire Pi community. Every bit of support makes a huge difference!
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label className="font-medium text-center block">Choose an amount (π)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {presetAmounts.map(preset => (
                        <Button 
                        key={preset}
                        variant={!isCustom && amount === preset ? "default" : "outline"}
                        onClick={() => handlePresetSelect(preset)}
                        className="h-12 text-lg"
                        >
                        {preset} π
                        </Button>
                    ))}
                    <Button 
                        variant={isCustom ? "default" : "outline"}
                        onClick={handleCustomSelect}
                        className="h-12 text-lg"
                    >
                        Custom
                    </Button>
                    </div>
                </div>

                {isCustom && (
                    <div>
                        <Label htmlFor="donation-amount" className="sr-only">Custom Donation Amount (Pi)</Label>
                        <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">π</span>
                        <Input
                            id="donation-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 2.5"
                            className="pl-9 h-14 text-xl text-center"
                            min="0.1"
                            step="0.1"
                        />
                        </div>
                    </div>
                )}
                </CardContent>
                <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" size="lg" disabled={!amount || parseFloat(amount) <= 0 || isDonating}>
                            <Send className="mr-2 h-4 w-4" />
                            Support with {amount && parseFloat(amount) > 0 ? amount : ''} π
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Support</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to contribute {amount} π to support Dynamic Pi Wallet View. This will be processed through the Pi Network. Are you sure?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDonate} disabled={isDonating}>
                            {isDonating ? <LoadingSpinner className="mr-2" /> : null}
                            {isDonating ? 'Processing...' : `Confirm ${amount} π Support`}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardFooter>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle>Community Goal</CardTitle>
                    <CardDescription>Help us reach our monthly target to cover server costs and development.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Progress value={donationProgress} aria-label="Donation goal progress" />
                    <div className="flex justify-between text-sm font-medium">
                        <span className="text-muted-foreground">{MOCK_CURRENT_DONATIONS.toFixed(2)}π Raised</span>
                        <span className="text-primary">{MOCK_GOAL}π Goal</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <RecentSupporters />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Why Your Support Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                        <Rocket className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                        <p><strong>New Features:</strong> We are constantly working on new tools and insights to make your Pi experience better.</p>
                    </div>
                     <div className="flex items-start gap-3">
                        <Server className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                        <p><strong>Server Costs:</strong> Your support helps keep the app fast, reliable, and available 24/7.</p>
                    </div>
                     <div className="flex items-start gap-3">
                        <Paintbrush className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                        <p><strong>Design & Polish:</strong> We're dedicated to creating the most beautiful and user-friendly Pi app.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
