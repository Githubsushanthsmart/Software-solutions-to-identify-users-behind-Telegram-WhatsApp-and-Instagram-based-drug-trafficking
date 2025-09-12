'use server';

import { generateAlertMessage } from '@/ai/flows/generate-alert-message';
import { SuspiciousLog } from '@/lib/types';

export async function createAlertForSuspiciousActivity(log: SuspiciousLog): Promise<{ alertMessage: string }> {
  try {
    const result = await generateAlertMessage({
      userName: log.user.name,
      userEmail: log.user.email,
      userPhone: log.user.phone,
      messageContent: log.message,
      confidenceScore: log.confidenceScore,
      timestamp: log.timestamp,
    });
    return result;
  } catch (error) {
    console.error('Error generating alert message:', error);
    return { alertMessage: 'Failed to generate AI alert. Manual review required.' };
  }
}
