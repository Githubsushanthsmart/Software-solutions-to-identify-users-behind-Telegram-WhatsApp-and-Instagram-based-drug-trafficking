import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-suspicious-activity.ts';
import '@/ai/flows/generate-alert-message.ts';
import '@/ai/flows/analyze-image-flow.ts';
import '@/ai/flows/analyze-audio-flow.ts';
