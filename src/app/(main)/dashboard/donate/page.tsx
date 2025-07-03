"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Send } from 'lucide-react';
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

export default function DonatePage() {
  const [amount, setAmount] = useState("1.0");
  const [isDonating, setIsDonating] = useState(false);
  const { toast } = useToast();

  const handleDonate = () => {
    // In a real app, this would trigger the Pi SDK payment flow.
    // Here, we simulate it.
    setIsDonating(true);
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
            toast({
                title: "Thank you for your support!",
                description: `Your donation of ${amount} Pi is greatly appreciated.`,
            });
        } else {
            toast({
                title: "Donation Failed",
                description: "There was an issue processing your donation. Please try again.",
                variant: "destructive",
            });
        }
        setIsDonating(false);
    }, 1500); // Simulate network delay
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Support Our Project</h1>
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-pink-500" />
            Support Dynamic Pi Wallet View
          </CardTitle>
          <CardDescription>
            Your contributions help us maintain and improve this application for the entire Pi community. Every donation makes a difference!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="donation-amount" className="text-lg font-medium">Donation Amount (Pi)</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">π</span>
              <Input
                id="donation-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 1.0"
                className="pl-8 text-lg"
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="w-full" size="lg" disabled={!amount || parseFloat(amount) <= 0}>
                    <Send className="mr-2 h-4 w-4" />
                    Donate with Pi
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirm Donation</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to donate {amount} Pi to support Dynamic Pi Wallet View. This will be processed through the Pi Network. Are you sure you want to continue?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDonate} disabled={isDonating}>
                    {isDonating ? <LoadingSpinner className="mr-2" /> : null}
                    {isDonating ? 'Processing...' : 'Confirm Donation'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
