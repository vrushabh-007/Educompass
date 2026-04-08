'use server';

/**
 * @fileOverview Summarizes a college profile, extracting key information like acceptance rate,
 * popular programs, and campus life.
 *
 * - summarizeCollegeProfile - A function that summarizes the college profile.
 * - SummarizeCollegeProfileInput - The input type for the summarizeCollegeProfile function.
 * - SummarizeCollegeProfileOutput - The return type for the summarizeCollegeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCollegeProfileInputSchema = z.object({
  collegeName: z.string().describe('The name of the college.'),
  acceptanceRate: z.string().describe('The acceptance rate of the college.'),
  popularPrograms: z.string().describe('The popular programs offered at the college.'),
  campusLife: z.string().describe('A description of the campus life at the college.'),
  financialStatus: z.string().describe('The financial status of the student.'),
  studentScores: z.string().describe('The scores of the student.'),
  preferredCountry: z.string().describe('The preferred country of the student.'),
  examScores: z.string().describe('The exam scores of the student.'),
});
export type SummarizeCollegeProfileInput = z.infer<typeof SummarizeCollegeProfileInputSchema>;

const SummarizeCollegeProfileOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the college profile.'),
  recommendation: z.boolean().describe('Whether or not the college is recommended for the student.'),
});
export type SummarizeCollegeProfileOutput = z.infer<typeof SummarizeCollegeProfileOutputSchema>;

export async function summarizeCollegeProfile(input: SummarizeCollegeProfileInput): Promise<SummarizeCollegeProfileOutput> {
  return summarizeCollegeProfileFlow(input);
}

const summarizeCollegeProfilePrompt = ai.definePrompt({
  name: 'summarizeCollegeProfilePrompt',
  input: {schema: SummarizeCollegeProfileInputSchema},
  output: {schema: SummarizeCollegeProfileOutputSchema},
  prompt: `You are an expert college advisor.

  Based on the following information about the college and the student, provide a concise summary of the college profile, highlighting key aspects like acceptance rate, popular programs, and campus life.

  Also, determine whether or not the college is a good fit for the student based on their financial status, scores, preferred country and exam scores. Set the recommendation output field appropriately.

  College Name: {{{collegeName}}}
  Acceptance Rate: {{{acceptanceRate}}}
  Popular Programs: {{{popularPrograms}}}
  Campus Life: {{{campusLife}}}
  Student Financial Status: {{{financialStatus}}}
  Student Scores: {{{studentScores}}}
  Student Preferred Country: {{{preferredCountry}}}
  Student Exam Scores: {{{examScores}}}`,
});

const summarizeCollegeProfileFlow = ai.defineFlow(
  {
    name: 'summarizeCollegeProfileFlow',
    inputSchema: SummarizeCollegeProfileInputSchema,
    outputSchema: SummarizeCollegeProfileOutputSchema,
  },
  async input => {
    const {output} = await summarizeCollegeProfilePrompt(input);
    return output!;
  }
);
