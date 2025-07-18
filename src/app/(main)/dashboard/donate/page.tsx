
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SendIcon, HeartIcon, UsersIcon, TrendingUpIcon, AlertTriangleIcon } from '@/components/shared/icons';
import { RecentSupporters } from '@/components/dashboard/donate/RecentSupporters';
import { 
  addTransaction, 
  addNotification, 
  createDonationPayment
} from '@/services/piService';
import { isPiBrowser, isSandboxMode, getPiSDK } from '@/lib/pi-network';
import type { PiPayment } from '@/lib/pi-network';

export default function DonatePage() {
  const { user, refreshData } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [currentDonations, setCurrentDonations] = useState(0);
  const [recentSupporters, setRecentSupporters] = useState<Array<{ name: string; amount: number }>>([
    { name: "Pi Pioneer", amount: 5.0 },
    { name: "Crypto Enthusiast", amount: 2.5 },
    { name: "Blockchain Developer", amount: 10.0 },
    { name: "Pi Miner", amount: 1.0 },
    { name: "Community Member", amount: 3.0 },
  ]);

  const presetAmounts = [1, 2.5, 5, 10, 25];

  const handlePresetAmount = (presetAmount: number) => {
    setAmount(presetAmount.toString());
  };

  const handleDonate = async () => {
    if (!user) return;
    setIsDonating(true);
    
    try {
        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            toast({ title: "Invalid amount", variant: "destructive" });
            return;
        }

        // Check if user is authenticated with Pi Network (for Pi Browser)
        if (isPiBrowser()) {
            // Check if user has a valid access token
            if (!user.accessToken || user.accessToken === 'mock-token') {
                toast({
                    title: "Authentication Required",
                    description: "Please login with Pi Network first to make payments.",
                    variant: "destructive",
                });
                return;
            }

            // Additional check: verify the user is actually authenticated with Pi Network
            try {
                const sdk = getPiSDK();
                const isAuthenticated = await sdk.isAuthenticated();
                if (!isAuthenticated) {
                    toast({
                        title: "Authentication Required",
                        description: "Your Pi Network session has expired. Please login again.",
                        variant: "destructive",
                    });
                    return;
                }
            } catch (authError) {
                console.error('Authentication check failed:', authError);
                toast({
                    title: "Authentication Error",
                    description: "Unable to verify your Pi Network authentication. Please try logging in again.",
                    variant: "destructive",
                });
                return;
            }
        }

        let transactionDescription = "Donation to Dynamic Wallet View";
        if (message.trim()) {
            transactionDescription = message.trim();
        }

        // Create Pi Network payment
        const paymentData = {
            amount: donationAmount,
            memo: transactionDescription,
            metadata: {
                type: 'donation',
                app: 'dynamic-wallet-view',
                user_id: user.id,
                message: message.trim() || undefined,
            },
        };

        if (isPiBrowser()) {
            // Real Pi Network payment flow (Sandbox or Production)
            console.log('🔍 Pi Browser environment - using real Pi Network payments');
            console.log('🔍 User authenticated with token:', user.accessToken ? 'Present' : 'Missing');
            
            const payment = await createDonationPayment(donationAmount, message.trim(), {
                onReadyForServerApproval: async (paymentId: string) => {
                    console.log('Donation ready for approval:', paymentId);
                    console.log('Payment object being sent to server:', JSON.stringify(payment, null, 2));
                    
                    // Call server API to approve the payment
                    try {
                        const response = await fetch('/api/payments', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${user.accessToken || 'mock-token'}`,
                            },
                            body: JSON.stringify({
                                action: 'complete',
                                payment: payment,
                            }),
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('Server response error:', response.status, errorText);
                            throw new Error(`Failed to approve payment on server: ${response.status} ${errorText}`);
                        }

                        const result = await response.json();
                        console.log('Payment approved on server:', paymentId, result);
                    } catch (error) {
                        console.error('Server approval failed:', error);
                        // Continue with payment flow even if server approval fails
                    }
                },
                onReadyForServerCompletion: (paymentId: string, txid: string) => {
                    console.log('Donation completed:', paymentId, txid);
                    
                    // Add transaction to our app's history
                    addTransaction({
                        type: 'sent',
                        amount: donationAmount,
                        status: 'completed',
                        to: 'Dynamic Wallet View Project',
                        description: transactionDescription
                    });

                    // Add notification
                    addNotification({
                        type: 'announcement',
                        title: "Thank you for your support!",
                        description: `Your donation of ${donationAmount}π has been processed successfully.`,
                        link: '/dashboard/transactions'
                    });

                    toast({
                        title: "Thank you for your support!",
                        description: `Your donation of ${donationAmount} π has been processed successfully.`,
                    });
                },
                onCancel: (paymentId: string) => {
                    console.log('Donation cancelled:', paymentId);
                    toast({
                        title: "Donation Cancelled",
                        description: "Your donation was cancelled.",
                        variant: "destructive",
                    });
                },
                onError: (error: Error, payment: PiPayment) => {
                    console.error('Donation error:', error);
                    toast({
                        title: "Donation Failed",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            });
        } else {
            // Mock payment flow for development (non-Pi Browser)
            console.log('🔍 Development environment - using mock payment flow');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
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

            toast({
                title: "Thank you for your support!",
                description: `Your donation of ${donationAmount} π has been recorded.`,
            });
        }

        const newTotal = currentDonations + donationAmount;
        setCurrentDonations(newTotal);

        const newSupporter = { name: user.name, amount: donationAmount };
        setRecentSupporters(prev => [newSupporter, ...prev.slice(0, 9)]);

        refreshData();
        setMessage("");

    } catch (error) {
        console.error('Donation error:', error);
        toast({
            title: "Donation Failed",
            description: error instanceof Error ? error.message : "There was an issue processing your donation. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsDonating(false);
    }
  };

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6 overflow-hidden">
      <div className="text-center space-y-2 w-full max-w-full">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold break-words">Support Dynamic Wallet View</h1>
        <p className="text-muted-foreground text-sm sm:text-base break-words">
          Help us continue building amazing tools for the Pi Network community
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full">
        {/* Donation Form */}
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl break-words">
              <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
              Make a Donation
            </CardTitle>
            <CardDescription className="text-sm sm:text-base break-words">
              Your support helps us maintain and improve Dynamic Wallet View for the entire Pi Network community.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 w-full">
            {/* Authentication Notice for Pi Browser */}
            {isPiBrowser() && user && (!user.accessToken || user.accessToken === 'mock-token') && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangleIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Authentication Required</span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 break-words">
                  To make real Pi Network payments, you need to authenticate with your Pi Network account first. 
                  Please go to the login page and click "Login with Pi Network".
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/login')}
                  className="text-xs h-8"
                >
                  Go to Login
                </Button>
              </div>
            )}
            
            <div className="space-y-2 w-full">
              <label htmlFor="amount" className="text-sm font-medium">Amount (π)</label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.1"
                step="0.1"
                className="text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
              />
            </div>

            <div className="space-y-2 w-full">
              <label className="text-sm font-medium">Quick Amounts</label>
              <div className="flex flex-wrap gap-2">
                {presetAmounts.map((presetAmount) => (
                  <Button
                    key={presetAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetAmount(presetAmount)}
                    className="text-xs sm:text-sm min-h-[44px] sm:min-h-[40px]"
                  >
                    {presetAmount} π
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="message" className="text-sm font-medium">Message (Optional)</label>
              <Textarea
                id="message"
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-sm sm:text-base min-h-[80px]"
                rows={3}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-3 space-y-2 w-full">
              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium break-words">Community Impact</span>
              </div>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Server costs and infrastructure</li>
                <li>• Feature development and improvements</li>
                <li>• Community support and documentation</li>
                <li>• Security audits and maintenance</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full text-sm sm:text-base min-h-[44px] sm:min-h-[40px]" size="lg" disabled={!amount || parseFloat(amount) <= 0 || isDonating}>
                  <SendIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {isPiBrowser() && !isSandboxMode() 
                    ? `Support with ${amount && parseFloat(amount) > 0 ? amount : ''} π` 
                    : `Support with ${amount && parseFloat(amount) > 0 ? amount : ''} π (Mock)`
                  }
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Your Support</AlertDialogTitle>
                  <AlertDialogDescription className="break-words">
                    {isPiBrowser() 
                      ? `You are about to contribute ${amount} π to support Dynamic Wallet View. This will be processed through the Pi Network. Are you sure?`
                      : `You are about to contribute ${amount} π to support Dynamic Wallet View. This is a mock transaction for development purposes. Are you sure?`
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDonate} disabled={isDonating} className="min-h-[44px] sm:min-h-[40px]">
                    {isDonating ? <LoadingSpinner className="mr-2" /> : null}
                    {isDonating ? 'Processing...' : `Confirm ${amount} π Support`}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        {/* Community Stats */}
        <div className="space-y-4 sm:space-y-6 w-full max-w-full">
          <Card className="w-full max-w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl lg:text-2xl break-words">
                <TrendingUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                Community Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary break-words">
                    {currentDonations.toFixed(1)} π
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-words">Total Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary break-words">
                    {recentSupporters.length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground break-words">Supporters</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2 w-full">
                <h4 className="font-medium text-sm sm:text-base break-words">Recent Supporters</h4>
                <RecentSupporters supporters={recentSupporters} />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full max-w-full">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl break-words">Why Support Us?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-full">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm sm:text-base min-w-0 flex-1">
                  <span className="font-medium">Free & Open Source:</span> We believe in keeping our tools accessible to everyone in the Pi Network community.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm sm:text-base min-w-0 flex-1">
                  <span className="font-medium">Community Driven:</span> Your feedback and suggestions directly influence our development roadmap.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm sm:text-base min-w-0 flex-1">
                  <span className="font-medium">Privacy First:</span> We never collect or store your personal Pi Network data.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm sm:text-base min-w-0 flex-1">
                  <span className="font-medium">Continuous Improvement:</span> Regular updates with new features and improvements based on community needs.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
