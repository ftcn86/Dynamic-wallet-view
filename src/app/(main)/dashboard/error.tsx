
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangleIcon } from '@/components/shared/icons';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon size={36} />
          </div>
          <CardTitle className="text-2xl font-headline">Something Went Wrong</CardTitle>
          <CardDescription>We encountered an issue while loading this part of the dashboard. Please try again.</CardDescription>
        </CardHeader>
        <CardContent>
          {error?.message && (
            <p className="text-sm text-muted-foreground mb-4">
              Error details: {error.message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => reset()} className="w-full">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
