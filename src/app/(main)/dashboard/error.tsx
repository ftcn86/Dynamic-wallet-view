
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle size={36} className="text-destructive" />
          </div>
          <CardTitle className="text-2xl font-headline">{t('dashboardError.title')}</CardTitle>
          <CardDescription>{t('dashboardError.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboardError.detailsLabel')}: {error.message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => reset()} className="w-full">
            {t('dashboardError.retryButton')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
