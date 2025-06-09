"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { mockApiCall } from '@/lib/api';
import { mockUser } from '@/data/mocks';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ShieldQuestion } from 'lucide-react'; // Pi Network like icon

export default function LoginPage() {
  const { setUser, setIsLoading: setAuthIsLoading, isLoading: authIsLoading } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthIsLoading(true);
    try {
      const user = await mockApiCall({ data: mockUser });
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: t('login.error'),
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
      setAuthIsLoading(false);
    }
  };

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
            disabled={isLoggingIn || authIsLoading}
            size="lg"
          >
            {isLoggingIn || authIsLoading ? (
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
