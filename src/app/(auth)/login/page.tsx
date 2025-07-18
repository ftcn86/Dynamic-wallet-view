
"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { isPiBrowser, isSandboxMode } from '@/lib/pi-network';

export default function LoginPage() {
  const { user, login, isLoading: isAuthContextLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPiBrowserAvailable, setIsPiBrowserAvailable] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);

  useEffect(() => {
    // Check if we're in Pi Browser and sandbox mode
    setIsPiBrowserAvailable(isPiBrowser());
    setIsSandbox(isSandboxMode());
  }, []);

  useEffect(() => {
    if (!isAuthContextLoading && user) {
      if (user.termsAccepted) {
        router.replace('/dashboard');
      } else {
        router.replace('/legal/accept-terms');
      }
    }
  }, [user, isAuthContextLoading, router]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      const loggedInUser = await login();
      
      if (loggedInUser) {
        if (loggedInUser.termsAccepted) {
          router.push('/dashboard');
        } else {
          router.push('/legal/accept-terms');
        }
      } else {
        toast({
          title: "Authentication failed",
          description: "Could not authenticate with Pi Network. Please try again.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "An unexpected error occurred during authentication.",
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSandboxToggle = () => {
    // Toggle sandbox mode by updating URL
    const url = new URL(window.location.href);
    if (isSandbox) {
      url.searchParams.delete('sandbox');
    } else {
      url.searchParams.set('sandbox', 'true');
    }
    window.location.href = url.toString();
  };
  
  if (isAuthContextLoading || (!isAuthContextLoading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-3 sm:p-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Dynamic Wallet View Logo"
              width={64}
              height={64}
              className="h-12 w-12 sm:h-16 sm:w-16 rounded-full"
              data-ai-hint="logo abstract"
              priority
            />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-headline">Dynamic Wallet View</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {isSandbox ? 'Sandbox Mode' : 'Welcome to Dynamic Wallet View'}
          </CardDescription>
          {isSandbox && (
            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                🧪 Testing in Sandbox Mode
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!isPiBrowserAvailable ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                  🔗 For real Pi Network authentication, please open this app in the Pi Browser mobile app.
                </p>
              </div>
              <Button
                className="w-full text-sm sm:text-base"
                onClick={() => window.open('https://pi-browser.com', '_blank')}
                variant="outline"
                size="lg"
              >
                Download Pi Browser
              </Button>
              
              {/* Test Mode for all non-Pi Browser environments */}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground text-center mb-2">
                  For testing and development:
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin} // This now triggers mock login
                  disabled={isLoggingIn}
                  className="w-full text-xs"
                >
                  {isLoggingIn && <LoadingSpinner className="mr-2 h-3 w-3" />}
                  🧪 Test Mode (Mock Data)
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full text-sm sm:text-base"
              onClick={handleLogin}
              disabled={isLoggingIn}
              size="lg"
            >
              {isLoggingIn && <LoadingSpinner className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
              Login with Pi Network
            </Button>
          )}
          
          <CardDescription className="text-xs text-center px-2">
            {isPiBrowserAvailable 
              ? 'This will authenticate you using your Pi Network account.'
              : 'Use Test Mode to explore the app with mock data.'
            }
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className="text-center text-xs sm:text-sm w-full">
            <p className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
              <a href="/legal/terms" className="underline hover:text-primary">Terms of Service</a>
              <span className="hidden sm:inline"> | </span>
              <a href="/legal/privacy" className="underline hover:text-primary">Privacy Policy</a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
