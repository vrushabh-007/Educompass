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
  const model = ai.model('huggingFace/Micheal324/CollegeAdvisor-RAG');

  const response = await ai.generate({
    model,
    prompt: {
      messages: history,
    },
    config: {
      maxNewTokens: 250,
      temperature: 0.7,
    },
  });

  return response.text;
}
