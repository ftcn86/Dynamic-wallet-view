
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// Solid SVG Icon
const ShieldQuestionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#fff" strokeWidth="1.5" fill="none"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#fff" strokeWidth="1.5" fill="none"/>
  </svg>
);


export default function LoginPage() {
  const { user, login, isLoading: isAuthContextLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    const loggedInUser = await login();
    
    if (loggedInUser) {
      if (loggedInUser.termsAccepted) {
        router.push('/dashboard');
      } else {
        router.push('/legal/accept-terms');
      }
    } else {
      toast({
        title: "Login failed.",
        description: "Could not authenticate. Please try again.",
        variant: 'destructive',
      });
    }
    setIsLoggingIn(false);
  };
  
  if (isAuthContextLoading || (!isAuthContextLoading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldQuestionIcon size={36} className="text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">Dynamic Pi Wallet View</CardTitle>
          <CardDescription>Welcome to Dynamic Pi Wallet View</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoggingIn}
            size="lg"
          >
            {isLoggingIn && <LoadingSpinner className="mr-2 h-5 w-5" />}
            Login with Pi
          </Button>
          <CardDescription className="text-xs text-center px-2">
            This will authenticate you using your Pi Network account.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            <p>
              <a href="/legal/terms" className="underline hover:text-primary">Terms of Service</a>
              {' | '}
              <a href="/legal/privacy" className="underline hover:text-primary">Privacy Policy</a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
