
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { mockApiCall } from '@/lib/api';
import { mockUser as defaultMockUser } from '@/data/mocks'; // Renamed to avoid conflict
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ShieldQuestion } from 'lucide-react'; // Pi Network like icon

export default function LoginPage() {
  const { user, setUser, isLoading: isAuthContextLoading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // If user is already logged in and terms accepted, redirect to dashboard
    // Or if logged in and terms not accepted, redirect to accept-terms
    // This handles scenarios where user lands on /login but is already authenticated
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
      // Ensure the mockUser for login always has termsAccepted: false or undefined
      // so the post-login check correctly routes to terms acceptance.
      // The AuthContext will persist the true value once accepted.
      const freshMockUser = { ...defaultMockUser, termsAccepted: user?.termsAccepted || false };
      const loggedInUser = await mockApiCall({ data: freshMockUser });
      
      setUser(loggedInUser); // This will persist to localStorage via AuthContext

      if (loggedInUser.termsAccepted) {
        router.push('/dashboard');
      } else {
        router.push('/legal/accept-terms');
      }
    } catch (error) {
      toast({
        title: t('login.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If still loading auth context or user is already determined (and useEffect will redirect), show loading or minimal UI.
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldQuestion size={36} />
          </div>
          <CardTitle className="text-3xl font-headline">{t('appName')}</CardTitle>
          <CardDescription>{t('login.welcome')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoggingIn}
            size="lg"
          >
            {isLoggingIn ? (
              <LoadingSpinner className="mr-2 h-5 w-5" />
            ) : null}
            {t('login.button')}
          </Button>
          <div className="mt-6 text-center text-sm">
            <p>
              <a href="/legal/terms" className="underline hover:text-primary">{t('legal.termsTitle')}</a>
              {' | '}
              <a href="/legal/privacy" className="underline hover:text-primary">{t('legal.privacyTitle')}</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
