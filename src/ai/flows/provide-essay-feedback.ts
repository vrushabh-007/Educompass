'use server';
/**
 * @fileOverview AI agent that provides feedback on a student's essay or SOP.
 *
 * - provideEssayFeedback - A function that analyzes an essay and provides structured feedback.
 * - EssayFeedback - The return type for the provideEssayFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EssayFeedbackSchema = z.object({
  summary: z.string().describe("A concise, one-paragraph summary of the essay's main points."),
  keyWords: z.array(z.string()).describe("A list of the 5-7 most important keywords or topics discussed in the essay."),
  feedback: z.string().describe("Constructive, actionable feedback for the student. Focus on clarity, structure, and how well the arguments are supported. Provide suggestions for improvement in a friendly and encouraging tone."),
});

export type EssayFeedback = z.infer<typeof EssayFeedbackSchema>;

export async function provideEssayFeedback(essayText: string): Promise<EssayFeedback> {
  return provideEssayFeedbackFlow(essayText);
}

const feedbackPrompt = ai.definePrompt({
  name: 'essayFeedbackPrompt',
  input: { schema: z.string() },
  output: { schema: EssayFeedbackSchema },
  prompt: `You are an expert admissions advisor and writing coach. Your task is to provide constructive feedback on the following Statement of Purpose (SOP) or essay. Analyze it based on the principles of the OpenEssayist system, focusing on content and structure.

  **Essay to Analyze:**
  {{input}}

  **Your Task (produce a JSON object with the following fields):**
  1.  **summary**: Write a brief, neutral summary of the essay's content. What are the main arguments or points the student is trying to make?
  2.  **keyWords**: Extract a list of the 5-7 most important and representative keywords or short phrases from the essay. These should reflect the core themes.
  3.  **feedback**: Provide clear, constructive, and actionable feedback. Address the following points in a paragraph:
      - How clear is the essay's narrative and structure (introduction, body, conclusion)?
      - Are the key topics distributed well, or are they concentrated in one area?
      - Does the essay effectively convey the student's intended message and goals?
      - Offer 1-2 specific suggestions for improvement. For example, "Consider strengthening the connection between your project experience and your long-term career goals in the third paragraph." or "Your introduction is strong, but the conclusion could be more impactful by summarizing your key strengths."
  
  Maintain a supportive and encouraging tone throughout the feedback.`,
});


const provideEssayFeedbackFlow = ai.defineFlow(
  {
    name: 'provideEssayFeedbackFlow',
    inputSchema: z.string(),
    outputSchema: EssayFeedbackSchema,
  },
  async (input) => {
    const { output } = await feedbackPrompt(input);
    return output!;
  }
);
