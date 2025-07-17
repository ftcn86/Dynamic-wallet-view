
"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';


const helpSections = [
    {
      "title": "Welcome to Help & Support!",
      "content": "**What is Dynamic Pi Wallet View?**\nDynamic Pi Wallet View is a third-party application designed to offer a dynamic and user-friendly interface for viewing your Pi Network related metrics. This includes your Pi balance, current mining rate, insights into your team's activity, and performance data if you operate a Pi Node."
    },
    {
      "title": "Is Dynamic Pi Wallet View an official Pi Network App?",
      "content": "No, Dynamic Pi Wallet View is an independent application developed by enthusiasts. It is not officially affiliated with, endorsed, or sponsored by the Pi Core Team or the Pi Network."
    },
    {
      "title": "How accurate is the data shown in Dynamic Pi Wallet View?",
      "content": "Currently, Dynamic Pi Wallet View uses MOCK (SIMULATED) DATA for all its features. This is for demonstration and development purposes. In a future version intended for live use, data accuracy would depend on the information provided by the official Pi Network APIs and the permissions you grant."
    },
    {
      "title": "Key Features Overview",
      "content": "*   **Dashboard:** At-a-glance view of your total Pi balance, mining rate, and active team members.\n*   **Balance Breakdown:** Detailed view of your Pi balance, including transferable, unverified, and locked-up amounts.\n*   **Balance Fluctuation Chart:** Visual representation of your balance changes over time.\n*   **Badge Showcase:** Display of earned badges within the Pi Network ecosystem (mocked).\n*   **Team Insights:** Information about your team members, their status, and contributions (mocked).\n*   **Node Analysis:** For node operators, metrics like uptime and performance score (mocked).\n*   **Settings:** Customize theme preferences."
    },
    {
      "title": "Troubleshooting Common Issues",
      "content": "*   **App not loading or showing errors:** As Dynamic Pi Wallet View currently uses mock data, persistent errors might indicate a problem with the application itself. Please try refreshing. If issues continue, contact support.\n*   **Data seems incorrect:** Remember, all data in this version is simulated. It does not reflect your actual Pi Network account."
    },
    {
      "title": "Contacting Support",
      "content": "If you have questions specific to the Dynamic Pi Wallet View application, encounter bugs, or have feedback, please email us at support@example.com.\n\nFor any questions or issues regarding your actual Pi Network account, mining, KYC, or official Pi Network policies, please refer to the support channels provided by the Pi Network (e.g., in-app support in the official Pi app, official Pi Network website and community channels)."
    }
];

function FeedbackCard() {
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
                    <MessageSquare className="mr-2 h-6 w-6 text-primary" />
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
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl">
            <LegalPageLayout
              pageTitle="Help & Support"
              sections={helpSections}
              displayMode="accordion"
            />
            <FeedbackCard />
        </div>
    </div>
  );
}
