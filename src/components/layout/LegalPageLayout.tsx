"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import type { LegalSection } from '@/data/schemas';
import { useAuth } from '@/contexts/AuthContext';

interface LegalPageLayoutProps {
  pageTitle: string;
  sections?: LegalSection[]; 
  content?: string; 
  displayMode: 'accordion' | 'markdown';
}

export default function LegalPageLayout({ pageTitle, sections, content, displayMode }: LegalPageLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleReturn = () => {
    if (user && user.termsAccepted) {
      router.back();
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{pageTitle}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {displayMode === 'accordion' && sections && sections.length > 0 ? (
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
            <p>Content is not available.</p> 
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleReturn}>
            <ArrowLeft className="mr-2 h-4 w-4 text-primary" />
            {user && user.termsAccepted ? "Return to App" : "Return to Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
