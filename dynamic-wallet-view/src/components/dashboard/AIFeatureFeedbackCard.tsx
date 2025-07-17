
"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15.09 16.09a7 7 0 0 1-5.59-8.59l.39-2.02.39-2.02A1 1 0 0 1 11 2h2a1 1 0 0 1 .9.56l.39 2.02.39 2.02a7 7 0 0 1-5.59 8.59Z" fill="hsl(var(--primary))"/>
    <path d="M18.81 19.92a4 4 0 0 1-5.66 5.66" />
    <path d="M12 22v-2" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" {...props}>
        <path d="m22 2-7 20-4-9-9-4Z" fill="hsl(var(--primary-foreground))" />
        <path d="m22 2-11 11" stroke="hsl(var(--primary))" strokeWidth="1" />
    </svg>
);


export function AIFeatureFeedbackCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({
        title: "Please enter your feedback",
        description: "Your thoughts are valuable to us!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("AI Feature Feedback Submitted:", {
        userId: user?.id,
        feedback: feedback
    });

    toast({
        title: "Thank You!",
        description: "Your feedback has been submitted. We appreciate you helping shape the future of this app.",
    });

    setFeedback("");
    setIsSubmitting(false);
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="w-6 h-6" />
                Future AI Feature: Get Your Opinion!
            </CardTitle>
            <CardDescription>
                We're considering an AI-powered feature to give you personalized strategies for boosting your mining rate. Would this be useful to you?
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                <div className="flex-grow">
                    <Textarea
                        id="feedback-textarea"
                        placeholder="e.g., 'Yes, I'd love to know how lockups affect my rate!' or 'No, I prefer simpler tools.'"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        disabled={isSubmitting}
                        className="h-full"
                    />
                </div>
            </form>
        </CardContent>
         <CardFooter>
            <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting || !feedback.trim()}>
                {isSubmitting ? <LoadingSpinner className="mr-2" /> : <SendIcon className="mr-2 h-4 w-4" />}
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
        </CardFooter>
    </Card>
  );
}
