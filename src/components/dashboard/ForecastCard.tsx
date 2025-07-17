
"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { generateMiningForecast, MiningForecastOutput } from '@/ai/flows/forecast-flow';
import { mockTeam } from '@/data/mocks';

const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15.09 16.09a7 7 0 0 1-5.59-8.59l.39-2.02.39-2.02A1 1 0 0 1 11 2h2a1 1 0 0 1 .9.56l.39 2.02.39 2.02a7 7 0 0 1-5.59 8.59Z" fill="hsl(var(--primary))"/>
    <path d="M18.81 19.92a4 4 0 0 1-5.66 5.66" />
    <path d="M12 22v-2" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 6L9 17l-5-5" stroke="#22c55e" />
    </svg>
);


export function ForecastCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [question, setQuestion] = useState("How can I double my mining rate?");
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<MiningForecastOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !question.trim()) {
      toast({
        title: "Please enter a question",
        description: "You need to ask a question to get a forecast.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setForecast(null);

    try {
      const activeTeamMembers = mockTeam.filter(m => m.status === 'active').length;
      const result = await generateMiningForecast({
        currentRate: user.miningRate,
        teamSize: mockTeam.length,
        activeTeamMembers: activeTeamMembers,
        question: question,
      });
      setForecast(result);
    } catch (error) {
      console.error("Error generating forecast:", error);
      toast({
        title: "Failed to Get Forecast",
        description: "There was an issue with the AI model. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="forecast-question" className="block text-sm font-medium text-muted-foreground mb-2">
            Ask for a personalized forecast or strategy
          </label>
          <Textarea
            id="forecast-question"
            placeholder="e.g., How can I reach 0.5 π/hr?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !question.trim()}>
          {isLoading ? <LoadingSpinner className="mr-2" /> : null}
          {isLoading ? 'Generating Forecast...' : 'Get AI Forecast'}
        </Button>
      </form>

      {isLoading && (
        <div className="space-y-4">
            <div className="animate-pulse rounded-lg border bg-card p-4 space-y-3">
                <div className="h-5 w-1/3 bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-3/4 bg-muted rounded-md" />
                <div className="h-8 w-1/2 bg-muted rounded-md mt-2" />
            </div>
        </div>
      )}

      {forecast && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LightbulbIcon className="w-6 h-6" />
              Your Personalized Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-primary">Insight</h3>
              <p className="text-sm text-muted-foreground">{forecast.insight}</p>
            </div>
            <div>
              <h3 className="font-semibold text-primary">Recommended Strategy</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {forecast.strategy.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckIcon className="h-4 w-4 mt-1 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-accent/10 p-3 text-center">
                    <p className="text-xs font-semibold uppercase text-accent">New Estimated Rate</p>
                    <p className="text-xl font-bold text-accent">{forecast.forecast.newMiningRate}</p>
                </div>
                <div className="rounded-lg bg-accent/10 p-3 text-center">
                    <p className="text-xs font-semibold uppercase text-accent">Estimated Timeline</p>
                    <p className="text-xl font-bold text-accent">{forecast.forecast.timeline}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
