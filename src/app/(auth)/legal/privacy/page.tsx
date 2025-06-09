"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('legal.privacyTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-h-[60vh] overflow-y-auto">
          <p>{t('legal.privacyContent')}</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('legal.returnToLogin')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
