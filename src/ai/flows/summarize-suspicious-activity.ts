'use server';

/**
 * @fileOverview Summarizes recent suspicious activity for administrators.
 *
 * - summarizeSuspiciousActivity - A function that summarizes recent suspicious activity.
 * - SummarizeSuspiciousActivityInput - The input type for the summarizeSuspiciousActivity function.
 * - SummarizeSuspiciousActivityOutput - The return type for the summarizeSuspiciousActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSuspiciousActivityInputSchema = z.object({
  activityLogs: z.array(
    z.object({
      user: z.object({
        name: z.string().describe('The name of the user.'),
        email: z.string().email().describe('The email of the user.'),
        phone: z.string().describe('The phone number of the user.'),
      }).describe('The user details'),
      message: z.string().describe('The suspicious message content.'),
      timestamp: z.string().datetime().describe('The timestamp of the activity.'),
      confidenceScore: z.number().describe('The confidence score of the suspicious activity.'),
    })
  ).describe('A list of recent suspicious activity logs.'),
});
export type SummarizeSuspiciousActivityInput = z.infer<typeof SummarizeSuspiciousActivityInputSchema>;

const SummarizeSuspiciousActivityOutputSchema = z.object({
  summary: z.string().describe('A summary of the recent suspicious activity.'),
});
export type SummarizeSuspiciousActivityOutput = z.infer<typeof SummarizeSuspiciousActivityOutputSchema>;

export async function summarizeSuspiciousActivity(
  input: SummarizeSuspiciousActivityInput
): Promise<SummarizeSuspiciousActivityOutput> {
  return summarizeSuspiciousActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSuspiciousActivityPrompt',
  input: {schema: SummarizeSuspiciousActivityInputSchema},
  output: {schema: SummarizeSuspiciousActivityOutputSchema},
  prompt: `You are an AI assistant helping an administrator understand recent suspicious activity on a chat platform.

  Summarize the following suspicious activity logs to highlight any potential threats or patterns. Be concise and focus on the key details from the logs.

  Suspicious Activity Logs:
  {{#each activityLogs}}
  - User: {{this.user.name}} ({{this.user.email}}, {{this.user.phone}})
    - Message: "{{this.message}}"
    - Timestamp: {{this.timestamp}}
    - Confidence Score: {{this.confidenceScore}}
  {{/each}}

  Summary:`,
});

const summarizeSuspiciousActivityFlow = ai.defineFlow(
  {
    name: 'summarizeSuspiciousActivityFlow',
    inputSchema: SummarizeSuspiciousActivityInputSchema,
    outputSchema: SummarizeSuspiciousActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
