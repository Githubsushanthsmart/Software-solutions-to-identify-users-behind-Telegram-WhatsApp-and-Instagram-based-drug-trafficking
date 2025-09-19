'use server';

/**
 * @fileOverview An AI agent for detecting fake profile pictures.
 *
 * - detectFakeProfile - A function that handles the profile picture analysis.
 * - DetectFakeProfileInput - The input type for the detectFakeProfile function.
 * - DetectFakeProfileOutput - The return type for the detectFakeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectFakeProfileInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A profile photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectFakeProfileInput = z.infer<typeof DetectFakeProfileInputSchema>;

const DetectFakeProfileOutputSchema = z.object({
  isFake: z.boolean().describe('Whether or not the profile picture is likely to be fake.'),
  reason: z.string().describe('The reason for the verdict (e.g., "Stock Photo", "Celebrity", "Widely Used Image", "Appears Genuine").'),
  confidenceScore: z.number().describe('The confidence score of the detection from 0 to 1.'),
});
export type DetectFakeProfileOutput = z.infer<typeof DetectFakeProfileOutputSchema>;

export async function detectFakeProfile(input: DetectFakeProfileInput): Promise<DetectFakeProfileOutput> {
  return detectFakeProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFakeProfilePrompt',
  input: {schema: DetectFakeProfileInputSchema},
  output: {schema: DetectFakeProfileOutputSchema},
  prompt: `You are an expert in fake profile detection for social media platforms. Your task is to analyze the provided profile picture and determine if it is likely to be fake.

  Reasons for flagging a profile as FAKE include:
  - The image is a stock photo.
  - The image is of a known celebrity or public figure.
  - The image is a widely used meme or internet picture.
  - The image appears to be computer-generated or an avatar.

  If the image appears to be a genuine picture of a real, non-celebrity person, classify it as not fake.

  Analyze the image and provide a verdict, a brief reason for your decision, and a confidence score.

  Image: {{media url=photoDataUri}}`,
});

const detectFakeProfileFlow = ai.defineFlow(
  {
    name: 'detectFakeProfileFlow',
    inputSchema: DetectFakeProfileInputSchema,
    outputSchema: DetectFakeProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
