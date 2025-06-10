
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { mockApiCall } from '@/lib/api';
import { mockUser as defaultMockUser } from '@/data/mocks'; 
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ShieldQuestion, Fingerprint } from 'lucide-react'; 

const PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY = 'piPulseDeviceLoginEnabledHint';

export default function LoginPage() {
  const { user, setUser, isLoading: isAuthContextLoading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDeviceLoginHint, setShowDeviceLoginHint] = useState(false);

  useEffect(() => {
    // Check if the device login hint should be shown
    if (typeof window !== 'undefined') {
        const hintEnabled = localStorage.getItem(PI_PULSE_DEVICE_LOGIN_ENABLED_HINT_KEY) === 'true';
        setShowDeviceLoginHint(hintEnabled);
    }

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
      const freshMockUser = { 
        ...defaultMockUser, 
        termsAccepted: user?.termsAccepted || false,
        // Preserve deviceLoginEnabled if it was set in a previous session stored in localStorage
        // This ensures if the mockUser default is false, but user had it true, it's kept.
        deviceLoginEnabled: user?.deviceLoginEnabled || defaultMockUser.deviceLoginEnabled || false 
      };
      const loggedInUser = await mockApiCall({ data: freshMockUser });
      
      setUser(loggedInUser); 

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
  
  const handleDeviceLoginPlaceholder = () => {
    toast({
        title: t('login.deviceLogin.placeholderTitle'),
        description: t('login.deviceLogin.placeholderDescription'),
    });
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldQuestion size={36} />
          </div>
          <CardTitle className="text-3xl font-headline">{t('appName')}</CardTitle>
          <CardDescription>{t('login.welcome')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoggingIn}
            size="lg"
          >
            {isLoggingIn && <LoadingSpinner className="mr-2 h-5 w-5" />}
            {t('login.button')}
          </Button>
          <CardDescription className="text-xs text-center px-2">
            {t('login.piAuthInfo')}
          </CardDescription>

          {showDeviceLoginHint && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDeviceLoginPlaceholder}
              size="lg"
            >
              <Fingerprint className="mr-2 h-5 w-5" />
              {t('login.deviceLogin.button')}
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            <p>
              <a href="/legal/terms" className="underline hover:text-primary">{t('legal.termsTitle')}</a>
              {' | '}
              <a href="/legal/privacy" className="underline hover:text-primary">{t('legal.privacyTitle')}</a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
