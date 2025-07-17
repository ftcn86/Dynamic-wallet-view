
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { MOCK_DONATION_GOAL, MOCK_CURRENT_DONATIONS, MOCK_RECENT_DONATIONS } from '@/data/mocks';
import { RecentSupporters } from '@/components/dashboard/donate/RecentSupporters';
import { addTransaction, addNotification } from '@/services/piService';
import { GiftIcon, SendIcon, RocketIcon, ServerIcon, PaintbrushIcon } from '@/components/shared/icons';

const presetAmounts = ["1", "5", "10", "20"];

export default function DonatePage() {
  const [amount, setAmount] = useState("5");
  const [message, setMessage] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  
  const [currentDonations, setCurrentDonations] = useState(MOCK_CURRENT_DONATIONS);
  const [recentSupporters, setRecentSupporters] = useState(MOCK_RECENT_DONATIONS);
  const [donationProgress, setDonationProgress] = useState(0);

  const { toast } = useToast();
  const { user, refreshData } = useAuth();

  useEffect(() => {
    setDonationProgress((currentDonations / MOCK_DONATION_GOAL) * 100);
  }, [currentDonations]);

  const handlePresetSelect = (presetAmount: string) => {
    setAmount(presetAmount);
    setIsCustom(false);
  }

  const handleCustomSelect = () => {
    setIsCustom(true);
    setAmount("");
  }

  const handleDonate = async () => {
    if (!user) return;
    setIsDonating(true);
    try {
        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            toast({ title: "Invalid amount", variant: "destructive" });
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let transactionDescription = "Donation to Dynamic Wallet View";
        if (message.trim()) {
            transactionDescription = message.trim();
        }
        
        await addTransaction({
            type: 'sent',
            amount: donationAmount,
            status: 'completed',
            to: 'Dynamic Wallet View Project',
            description: transactionDescription
        });

        await addNotification({
            type: 'announcement',
            title: "Thank you for your support!",
            description: `Your donation of ${donationAmount}π has been recorded.`,
            link: '/dashboard/transactions'
        });

        const newTotal = currentDonations + donationAmount;
        setCurrentDonations(newTotal);

        const newSupporter = { name: user.name, amount: donationAmount };
        setRecentSupporters(prev => [newSupporter, ...prev.slice(0, 9)]);

        toast({
            title: "Thank you for your support!",
            description: `Your donation of ${donationAmount} π has been recorded.`,
        });
        
        refreshData();
        setMessage("");

    } catch (error) {
        toast({
            title: "Donation Failed",
            description: "There was an issue processing your donation. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsDonating(false);
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Support Our Project</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card className="shadow-lg border-primary/20 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
                    <GiftIcon className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-headline">Join Us in Building the Future</CardTitle>
                <CardDescription className="max-w-md">
                    Your contributions are vital for maintaining and enhancing this app for the entire Pi community. Every bit of support makes a huge difference!
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="font-medium text-center block">Choose an amount (π)</Label>
                        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-2">
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
                            className="h-12 text-lg col-span-2 xs:col-span-1"
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

                    <div className="space-y-2">
                        <Label htmlFor="donation-message">Add an optional message</Label>
                        <Textarea 
                            id="donation-message"
                            placeholder="Say thanks or leave a suggestion..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" size="lg" disabled={!amount || parseFloat(amount) <= 0 || isDonating}>
                            <SendIcon className="mr-2 h-4 w-4" />
                            Support with {amount && parseFloat(amount) > 0 ? amount : ''} π
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Support</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to contribute {amount} π to support Dynamic Wallet View. This will be processed through the Pi Network. Are you sure?
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
                        <span className="text-muted-foreground">{currentDonations.toFixed(2)}π Raised</span>
                        <span className="text-primary">{MOCK_DONATION_GOAL}π Goal</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <RecentSupporters supporters={recentSupporters} />
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Why Your Support Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                        <RocketIcon className="h-5 w-5 mt-0.5 shrink-0" />
                        <p><strong>New Features:</strong> We are constantly working on new tools and insights to make your Pi experience better.</p>
                    </div>
                     <div className="flex items-start gap-3">
                        <ServerIcon className="h-5 w-5 mt-0.5 shrink-0" />
                        <p><strong>Server Costs:</strong> Your support helps keep the app fast, reliable, and available 24/7.</p>
                    </div>
                     <div className="flex items-start gap-3">
                        <PaintbrushIcon className="h-5 w-5 mt-0.5 shrink-0" />
                        <p><strong>Design & Polish:</strong> We're dedicated to creating the most beautiful and user-friendly Pi app.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
