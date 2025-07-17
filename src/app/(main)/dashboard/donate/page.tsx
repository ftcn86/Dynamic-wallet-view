
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
import { cn } from '@/lib/utils';

const presetAmounts = ["1", "5", "10"];

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Support Our Project</h1>
      <Card className="max-w-2xl mx-auto shadow-lg border-primary/20 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-500/10 mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-headline">Support Dynamic Pi Wallet View</CardTitle>
          <CardDescription className="max-w-md">
            Your contributions help us maintain and improve this application for the entire Pi community. Every donation makes a difference!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="font-medium text-center block">Choose an amount (π)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                    Donate with Pi
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirm Donation</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to donate {amount} π to support Dynamic Pi Wallet View. This will be processed through the Pi Network. Are you sure?
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDonate} disabled={isDonating}>
                    {isDonating ? <LoadingSpinner className="mr-2" /> : null}
                    {isDonating ? 'Processing...' : `Confirm ${amount} π Donation`}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
