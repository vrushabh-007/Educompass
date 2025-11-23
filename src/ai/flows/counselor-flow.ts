'use server';
/**
 * @fileOverview AI conversational counselor for college advice.
 *
 * - counselorFlow - A function that handles the chatbot conversation.
 * - ChatMessage - The input/output type for chat messages.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const CounselorFlowInputSchema = z.array(ChatMessageSchema);
export type CounselorFlowInput = z.infer<typeof CounselorFlowInputSchema>;

export async function counselorFlow(history: CounselorFlowInput): Promise<string> {
  const model = ai.model('gemini-2.0-flash');

  const systemInstruction = `You are an expert AI College Counselor. Your goal is to provide personalized college advice.

  1.  Start the conversation by introducing yourself.
  2.  You must ask the user for the following information before giving any recommendations:
      - GPA (Grade Point Average)
      - Standardized test scores (like GRE, TOEFL, IELTS, etc.)
      - Financial constraints or budget for tuition.
      - Their desired major or field of study.
  3.  Once you have gathered all this information, provide thoughtful and relevant advice based on the user's complete profile. Do not provide recommendations until you have all the pieces of information.
  4.  Keep your responses concise and friendly.`;

  const response = await ai.generate({
    model,
    prompt: {
      system: systemInstruction,
      messages: history,
    },
    config: {
      maxNewTokens: 250,
      temperature: 0.7,
    },
  });

  return response.text;
}
