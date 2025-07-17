
"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { submitFeedback } from '@/services/piService';
import { LightbulbIcon, SendIcon } from '@/components/shared/icons';

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
    try {
        await submitFeedback({
            type: 'ai_feature',
            message: feedback,
            userId: user?.id
        });
        toast({
            title: "Thank You!",
            description: "Your feedback has been submitted. We appreciate you helping shape the future of this app.",
        });
        setFeedback("");
    } catch (error) {
        toast({
            title: "Submission Failed",
            description: "Could not submit your feedback. Please try again later.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="w-6 h-6" />
                Future AI Tool: Mining Rate Forecaster
            </CardTitle>
            <CardDescription>
              We are developing an AI tool to help you forecast your potential mining rate based on different lockup scenarios. Is this a feature you would use?
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col">
                <div className="flex-grow">
                    <Textarea
                        id="feedback-textarea"
                        placeholder="e.g., 'Yes, that would help me decide on a lockup strategy.' or 'No, the current calculator is enough for me.'"
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
