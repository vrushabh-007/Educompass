'use server';
/**
 * @fileOverview AI agent that recommends colleges based on student's academic scores, exam results, and preferences.
 *
 * - generateCollegeRecommendation - A function that handles the college recommendation process.
 * - GenerateCollegeRecommendationInput - The input type for the generateCollegeRecommendation function.
 * - GenerateCollegeRecommendationOutput - The return type for the generateCollegeRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCollegeRecommendationInputSchema = z.object({
  academicScores: z.object({
    cgpa: z.number().optional().describe('CGPA on a 4.0 scale.'),
    percentage: z.number().optional().describe('Percentage score.'),
  }).describe('Academic scores of the student.'),
  examResults: z.object({
    gre: z.number().optional().describe('GRE score.'),
    gmat: z.number().optional().describe('GMAT score.'),
    toefl: z.number().optional().describe('TOEFL score.'),
  }).describe('Exam results of the student.'),
  preferences: z.object({
    country: z.string().describe('Preferred country for studying (e.g., India, USA).'),
    financialStatus: z.string().describe('Financial status of the student.'),
    major: z.string().describe('The student chosen major'),
  }).describe('Student preferences for college selection.'),
  additionalInfo: z.string().optional().describe('Any additional information about the student.'),
});
export type GenerateCollegeRecommendationInput = z.infer<typeof GenerateCollegeRecommendationInputSchema>;

const CollegeSchema = z.object({
  collegeName: z.string().describe('The name of the college.'),
  location: z.string().describe('The location of the college.'),
  majorOffered: z.string().describe('The major offered by the college'),
  acceptanceRate: z.number().describe('The acceptance rate of the college'),
  description: z.string().describe('A short description of the college'),
  isGoodFit: z.boolean().describe('Whether the college is a good fit for the student based on their profile.'),
});

const GenerateCollegeRecommendationOutputSchema = z.array(CollegeSchema);

export type GenerateCollegeRecommendationOutput = z.infer<typeof GenerateCollegeRecommendationOutputSchema>;

export async function generateCollegeRecommendation(input: GenerateCollegeRecommendationInput): Promise<GenerateCollegeRecommendationOutput> {
  return generateCollegeRecommendationFlow(input);
}

const collegeRecommendationPrompt = ai.definePrompt({
  name: 'collegeRecommendationPrompt',
  input: {schema: GenerateCollegeRecommendationInputSchema},
  output: {schema: GenerateCollegeRecommendationOutputSchema},
  prompt: `You are an expert college advisor. Your task is to recommend a list of colleges to the student based on their academic scores, exam results, preferences, and additional information.

  The list of colleges will be in JSON format.

  Here is the student's profile:
  Academic Scores: CGPA: {{academicScores.cgpa}}, Percentage: {{academicScores.percentage}}
  Exam Results: GRE: {{examResults.gre}}, GMAT: {{examResults.gmat}}, TOEFL: {{examResults.toefl}}
  Preferences: Country: {{preferences.country}}, Financial Status: {{preferences.financialStatus}}, Major: {{preferences.major}}
  Additional Information: {{additionalInfo}}
  Instructions: Use the isGoodFit field to decide whether or not the college is a good fit for the student. Think step by step. Consider factors such as the student's scores, financial status, country preference and major. If you do not have enough information to determine whether the college is a good fit, set isGoodFit to false.
  `,
});

const generateCollegeRecommendationFlow = ai.defineFlow(
  {
    name: 'generateCollegeRecommendationFlow',
    inputSchema: GenerateCollegeRecommendationInputSchema,
    outputSchema: GenerateCollegeRecommendationOutputSchema,
  },
  async input => {
    const {output} = await collegeRecommendationPrompt(input);
    return output!;
  }
);
