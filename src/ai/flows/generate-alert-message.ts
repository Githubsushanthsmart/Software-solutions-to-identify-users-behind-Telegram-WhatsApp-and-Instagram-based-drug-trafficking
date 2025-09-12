// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates an alert message for suspicious activity.
 *
 * - generateAlertMessage - A function that generates an alert message based on suspicious activity details.
 * - GenerateAlertMessageInput - The input type for the generateAlertMessage function.
 * - GenerateAlertMessageOutput - The return type for the generateAlertMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAlertMessageInputSchema = z.object({
  userName: z.string().describe("The name of the user who sent the message."),
  userEmail: z.string().email().describe("The email of the user who sent the message."),
  userPhone: z.string().describe("The phone number of the user who sent the message."),
  messageContent: z.string().describe("The content of the suspicious message."),
  confidenceScore: z.number().describe("The confidence score of the suspicious activity detection."),
  timestamp: z.string().describe("The timestamp of when the message was sent."),
});
export type GenerateAlertMessageInput = z.infer<typeof GenerateAlertMessageInputSchema>;

const GenerateAlertMessageOutputSchema = z.object({
  alertMessage: z.string().describe("The generated alert message."),
});
export type GenerateAlertMessageOutput = z.infer<typeof GenerateAlertMessageOutputSchema>;

export async function generateAlertMessage(input: GenerateAlertMessageInput): Promise<GenerateAlertMessageOutput> {
  return generateAlertMessageFlow(input);
}

const generateAlertMessagePrompt = ai.definePrompt({
  name: 'generateAlertMessagePrompt',
  input: {schema: GenerateAlertMessageInputSchema},
  output: {schema: GenerateAlertMessageOutputSchema},
  prompt: `A suspicious message has been detected on the ChatSecure AI platform.

  User Details:
  - Name: {{{userName}}}
  - Email: {{{userEmail}}}
  - Phone: {{{userPhone}}}

  Message Details:
  - Content: {{{messageContent}}}
  - Confidence Score: {{{confidenceScore}}}
  - Timestamp: {{{timestamp}}}

  Generate a concise alert message summarizing the above information for an administrator. Focus on the most critical details indicating potential illegal activity. The message should clearly and urgently convey the need for review.
  `,
});

const generateAlertMessageFlow = ai.defineFlow(
  {
    name: 'generateAlertMessageFlow',
    inputSchema: GenerateAlertMessageInputSchema,
    outputSchema: GenerateAlertMessageOutputSchema,
  },
  async input => {
    const {output} = await generateAlertMessagePrompt(input);
    return output!;
  }
);
