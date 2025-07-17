/**
 * @fileOverview Schemas for the mining forecast AI agent.
 *
 * - MiningForecastInputSchema - The Zod schema for the input.
 * - MiningForecastInput - The TypeScript type for the input.
 * - MiningForecastOutputSchema - The Zod schema for the output.
 * - MiningForecastOutput - The TypeScript type for the output.
 */

import { z } from 'zod';

export const MiningForecastInputSchema = z.object({
  currentRate: z.number().describe("The user's current mining rate in Pi/hour."),
  teamSize: z.number().describe('The total number of members in the user\'s team.'),
  activeTeamMembers: z.number().describe('The number of currently active team members.'),
  question: z.string().describe("The user's specific question or goal regarding their mining performance."),
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
