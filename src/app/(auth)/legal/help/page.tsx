
"use client"

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export default function HelpPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const handleReturn = () => {
    if (user) {
      router.back();
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('legal.helpTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-h-[60vh] overflow-y-auto">
          <p>{t('legal.helpContent')}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleReturn}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {user ? t('legal.returnAction') : t('legal.returnToLogin')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
