
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import type { LegalSection } from '@/data/schemas';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface LegalPageLayoutProps {
  pageTitleKey: string;
  sectionsKey?: string; 
  contentKey?: string; 
  displayMode: 'accordion' | 'markdown';
}

export default function LegalPageLayout({ pageTitleKey, sectionsKey, contentKey, displayMode }: LegalPageLayoutProps) {
  const { t, getLegalSections, getRawTranslation } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const handleReturn = () => {
    if (user) {
      router.back();
    } else {
      router.push('/login');
    }
  };

  const pageTitle = t(pageTitleKey);
  const sections = displayMode === 'accordion' && sectionsKey ? getLegalSections(sectionsKey) : [];
  const content = displayMode === 'markdown' && contentKey ? getRawTranslation(contentKey) as string : '';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          {displayMode === 'accordion' && sections.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {sections.map((section, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent className="prose dark:prose-invert max-w-none px-1 pb-4">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : displayMode === 'markdown' && content ? (
            <div className="prose dark:prose-invert max-w-none px-1 pb-4">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <p>{t('shared.loading')}</p> 
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleReturn}>
            <ArrowLeft className="mr-2 h-4 w-4 text-primary" />
            {user ? t('legal.returnAction') : t('legal.returnToLogin')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
