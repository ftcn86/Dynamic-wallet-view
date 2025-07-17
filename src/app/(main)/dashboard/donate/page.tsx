
"use client"

import { useState } from 'react';
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
import { MOCK_DONATION_GOAL, MOCK_CURRENT_DONATIONS } from '@/data/mocks';
import { RecentSupporters } from '@/components/dashboard/donate/RecentSupporters';
import { addTransaction, addNotification } from '@/services/piService';

// Solid SVG Icons
const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 12v10H4V12" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    <path d="M2 7h20v5H2z" stroke="hsl(var(--accent))" strokeWidth="1.5" fill="hsl(var(--accent))" />
    <path d="M12 22V7" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="hsl(var(--accent))" strokeWidth="1.5" fill="hsl(var(--accent))"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="hsl(var(--accent))" strokeWidth="1.5" fill="hsl(var(--accent))"/>
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="m22 2-7 20-4-9-9-4Z" fill="hsl(var(--primary-foreground))"/>
    <path d="m22 2-11 11" stroke="hsl(var(--primary-foreground))" />
  </svg>
);

const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--accent))" {...props}>
        <path d="M13.29,12.71,11.29,14.71,2,5,9.29,2,19,11.71,17.29,13.41,20,16.12,22,14,13.29,12.71ZM9.29,4.12,4,9.41l7.29,2.88,2.88,7.29,5.29-5.29L9.29,4.12Z" />
        <path d="M21.41,17.83,19,15.41l-2.59,2.59,2.41,2.41a2,2,0,0,0,2.83,0h0a2,2,0,0,0,0-2.83Z" />
    </svg>
);

const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--accent))" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="#fff" strokeWidth="2" />
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="#fff" strokeWidth="2" />
    </svg>
);

const PaintbrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(var(--accent))" {...props}>
        <path d="M18.37,3.63a2.12,2.12,0,0,0-3,0L13,6,6,13l-3,3,7,7,3-3,7-7,2.37-2.37a2.12,2.12,0,0,0,0-3Z"/>
        <path d="M6,13l3,3-4,4H17l-4-4,3-3-4.29-4.29-3.42,3.42Z"/>
    </svg>
);


const presetAmounts = ["1", "5", "10", "20"];

export default function DonatePage() {
  const [amount, setAmount] = useState("5");
  const [message, setMessage] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const { toast } = useToast();
  const { user, refreshData } = useAuth();


  const handlePresetSelect = (presetAmount: string) => {
    setAmount(presetAmount);
    setIsCustom(false);
  }

  const handleCustomSelect = () => {
    setIsCustom(true);
    setAmount("");
  }

  const handleDonate = async () => {
    setIsDonating(true);
    try {
        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            toast({ title: "Invalid amount", variant: "destructive" });
            return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let transactionDescription = "Donation";
        if (message.trim()) {
            transactionDescription += `: ${message.trim()}`;
        }
        
        // Add transaction
        await addTransaction({
            type: 'sent',
            amount: donationAmount,
            status: 'completed',
            to: 'Dynamic Pi Wallet View Project',
            description: transactionDescription
        });

        // Add notification
        await addNotification({
            type: 'announcement',
            title: "Thank you for your support!",
            description: `Your donation of ${donationAmount}π has been recorded.`,
            link: '/dashboard/transactions'
        });

        toast({
            title: "Thank you for your support!",
            description: `Your donation of ${donationAmount} π has been recorded.`,
        });

        // Trigger a refresh of data-dependent components
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

  const donationProgress = (MOCK_CURRENT_DONATIONS / MOCK_DONATION_GOAL) * 100;

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
                        <span className="text-primary">{MOCK_DONATION_GOAL}π Goal</span>
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
