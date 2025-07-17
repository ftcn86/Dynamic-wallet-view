
"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useTranslation } from '@/hooks/useTranslation';

// Solid SVG Icons
const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="m22 2-11 11"/>
  </svg>
);


function FeedbackCard() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) {
            toast({
                title: "Feedback is empty",
                description: "Please write some feedback before submitting.",
                variant: "destructive"
            });
            return;
        }
        setIsSubmitting(true);
        // Simulate an API call
        setTimeout(() => {
            console.log("Feedback submitted:", feedback);
            toast({
                title: "Feedback Submitted",
                description: "Thank you! We appreciate you helping us improve."
            });
            setFeedback("");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <Card className="w-full max-w-2xl shadow-xl mt-6">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <MessageSquareIcon className="mr-2 h-6 w-6 text-primary" />
                    Submit Feedback
                </CardTitle>
                <CardDescription>
                    Have a suggestion or found a bug? Let us know!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder="Type your feedback here..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        disabled={isSubmitting}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <LoadingSpinner className="mr-2" />
                        ) : (
                            <SendIcon className="mr-2 h-4 w-4" />
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function HelpPage() {
  const { t, getLegalSections } = useTranslation();
  const helpSections = getLegalSections('legal.helpSections');

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4 py-8">
        <div className="w-full max-w-2xl">
            <LegalPageLayout
              pageTitle={t('legal.helpTitle')}
              sections={helpSections}
              displayMode="accordion"
            />
            <FeedbackCard />
        </div>
    </div>
  );
}
