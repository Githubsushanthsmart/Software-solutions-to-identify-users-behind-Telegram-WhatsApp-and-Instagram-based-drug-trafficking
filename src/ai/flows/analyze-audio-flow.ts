'use server';

/**
 * @fileOverview An audio analysis AI agent for detecting suspicious content.
 *
 * - analyzeAudio - A function that handles the audio analysis process.
 * - AnalyzeAudioInput - The input type for the analyzeAudio function.
 * - AnalyzeAudioOutput - The return type for the analyzeAudio function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { drugKeywords } from '@/lib/keywords';

const AnalyzeAudioInputSchema = z.object({
  audioDataUri: z.string().describe(
    "An audio clip to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type AnalyzeAudioInput = z.infer<typeof AnalyzeAudioInputSchema>;

const AnalyzeAudioOutputSchema = z.object({
  isSuspicious: z.boolean().describe('Whether or not the audio is suspicious.'),
  transcription: z.string().describe('The transcription of the audio.'),
  confidenceScore: z.number().describe('The confidence score of the detection from 0 to 1.'),
});
export type AnalyzeAudioOutput = z.infer<typeof AnalyzeAudioOutputSchema>;

export async function analyzeAudio(input: AnalyzeAudioInput): Promise<AnalyzeAudioOutput> {
  return analyzeAudioFlow(input);
}

const sttPrompt = ai.definePrompt({
  name: 'speechToTextPrompt',
  input: { schema: AnalyzeAudioInputSchema },
  prompt: `Transcribe the following audio recording: {{media url=audioDataUri}}`,
});

const analyzeAudioFlow = ai.defineFlow(
  {
    name: 'analyzeAudioFlow',
    inputSchema: AnalyzeAudioInputSchema,
    outputSchema: AnalyzeAudioOutputSchema,
  },
  async (input) => {
    const { text: transcription } = await sttPrompt(input);
    
    if (!transcription) {
      return {
        isSuspicious: false,
        transcription: '',
        confidenceScore: 0,
      };
    }
    
    const lowerCaseTranscription = transcription.toLowerCase();
    const foundKeywords = drugKeywords.filter(keyword => lowerCaseTranscription.includes(keyword));
    
    const isSuspicious = foundKeywords.length > 0;
    
    let confidenceScore = 0;
    if (isSuspicious) {
      // Simple scoring: more keywords = higher confidence
      confidenceScore = Math.min(0.7 + (foundKeywords.length * 0.1), 0.99);
    }
    
    return {
      isSuspicious,
      transcription,
      confidenceScore,
    };
  }
);
