'use server';
/**
 * @fileOverview An AI agent for providing personalized Pi mining forecasts.
 *
 * - generateMiningForecast - A function that handles the forecast generation.
 * - MiningForecastInput - The input type for the generateMiningForecast function.
 * - MiningForecastOutput - The return type for the generateMiningForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const MiningForecastInputSchema = z.object({
  currentRate: z.number().describe('The user\'s current mining rate in Pi/hour.'),
  teamSize: z.number().describe('The total number of members in the user\'s team.'),
  activeTeamMembers: z.number().describe('The number of currently active team members.'),
  question: z.string().describe('The user\'s specific question or goal regarding their mining performance.'),
});
export type MiningForecastInput = z.infer<typeof MiningForecastInputSchema>;

export const MiningForecastOutputSchema = z.object({
  insight: z.string().describe('A brief, insightful summary of the user\'s current situation.'),
  strategy: z.array(z.string()).describe('A list of 2-3 concrete, actionable steps the user can take to achieve their goal.'),
  forecast: z.object({
    newMiningRate: z.string().describe('The estimated new mining rate (e.g., "0.35 π/hr") if the strategy is followed.'),
    timeline: z.string().describe('An estimated timeline to achieve the goal (e.g., "within 2-3 months").'),
  }),
});
export type MiningForecastOutput = z.infer<typeof MiningForecastOutputSchema>;

export async function generateMiningForecast(input: MiningForecastInput): Promise<MiningForecastOutput> {
  return generateMiningForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'miningForecastPrompt',
  input: { schema: MiningForecastInputSchema },
  output: { schema: MiningForecastOutputSchema },
  prompt: `You are an expert analyst for the Pi Network, specializing in helping users (Pioneers) optimize their mining rate.

The user provides their current mining data and a specific question or goal. Your task is to provide a concise, actionable, and encouraging forecast.

User's Data:
- Current Mining Rate: {{currentRate}} π/hr
- Total Team Members: {{teamSize}}
- Active Team Members: {{activeTeamMembers}}

User's Goal: "{{question}}"

Based on this data and goal, generate a response in the specified JSON format.

Here are your guidelines:
1.  **Insight:** Briefly summarize their current situation. If they have a large team but low activity, point that out. If their rate is already good, acknowledge it.
2.  **Strategy:** Provide 2-3 specific, actionable steps. Focus on common Pi Network mechanics like increasing team activity, completing security circles, or considering node operation if applicable. Be realistic.
3.  **Forecast:** Estimate a new mining rate and a timeline. The rate should be a plausible increase based on the strategy. The timeline should be realistic (e.g., "in 4-6 weeks," "over the next quarter").

Example Scenario:
- User has 20 team members but only 5 are active.
- Goal: "How can I double my rate?"
- Your Insight might be: "You have a strong team foundation, but most of your earning potential is dormant due to inactivity."
- Your Strategy might include: "1. Ping your inactive members daily. 2. Send a broadcast message to your team explaining the benefits of mining together. 3. Ensure your security circle is 100% complete with active members."
- Your Forecast might be: A new rate that is a significant but reasonable increase, with a timeline of "within a month."

Generate the response now.`,
});

const generateMiningForecastFlow = ai.defineFlow(
  {
    name: 'generateMiningForecastFlow',
    inputSchema: MiningForecastInputSchema,
    outputSchema: MiningForecastOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate forecast from the AI model.');
    }
    return output;
  }
);
