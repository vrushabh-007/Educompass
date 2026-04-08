'use server';
/**
 * @fileOverview AI agent that helps students write their Statement of Purpose (SOP).
 *
 * - generateSop - A function that handles the SOP generation process.
 * - GenerateSopInput - The input type for the generateSop function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSopInputSchema = z.object({
  targetUniversity: z.string().describe("The university the student is applying to."),
  targetProgram: z.string().describe("The specific program/course the student is applying for."),
  academicBackground: z.string().describe("The student's academic history, including GPA, relevant courses, and university."),
  keyProjects: z.string().describe("Details of 1-2 significant projects, internships, or work experiences. Should include the student's role and impact."),
  careerGoals: z.string().describe("The student's short-term and long-term career goals after completing the program."),
  additionalInfo: z.string().optional().describe("Any other information, such as specific professors, research labs, or unique reasons for choosing this university."),
});

export type GenerateSopInput = z.infer<typeof GenerateSopInputSchema>;

export async function generateSop(input: GenerateSopInput): Promise<string> {
  const result = await generateSopFlow(input);
  return result;
}

const sopGenerationPrompt = ai.definePrompt({
  name: 'sopGenerationPrompt',
  input: { schema: GenerateSopInputSchema },
  prompt: `You are an expert admissions advisor specializing in crafting compelling Statements of Purpose (SOPs). Your task is to write a structured, formal, and persuasive SOP for a student based on the information provided. The SOP should be approximately 800-1000 words.

  **Student's Profile:**
  - **Target University:** {{targetUniversity}}
  - **Target Program:** {{targetProgram}}
  - **Academic Background:** {{academicBackground}}
  - **Key Projects/Experiences:** {{keyProjects}}
  - **Career Goals:** {{careerGoals}}
  - **Additional Information/Specific Interests:** {{#if additionalInfo}}{{additionalInfo}}{{else}}None provided.{{/if}}

  **Instructions for the SOP:**
  1.  **Introduction:** Start with a strong opening that grabs the reader's attention. Clearly state the program you are applying to ({{targetProgram}}) at {{targetUniversity}} and briefly introduce your motivation.
  2.  **Academic & Technical Background:** Elaborate on your academic journey ({{academicBackground}}). Connect your coursework and skills to the requirements of the {{targetProgram}}.
  3.  **Projects & Practical Experience:** Detail your experiences from {{keyProjects}}. Focus on what you accomplished, the skills you developed, and how this prepares you for the master's program.
  4.  **Why This Program and University:** Explain why you have chosen {{targetProgram}} at {{targetUniversity}}. Mention specific faculty, research labs, curriculum, or other unique aspects of the university. If provided, weave in the details from the "Additional Information" section.
  5.  **Career Goals:** Clearly articulate your short-term and long-term career aspirations ({{careerGoals}}) and explain how this program is a crucial step toward achieving them.
  6.  **Conclusion:** Summarize your key strengths and reiterate your strong interest in the program. End with a confident and forward-looking statement.

  Maintain a professional and enthusiastic tone throughout. Ensure the final output is only the text of the Statement of Purpose, without any extra titles, headers, or conversational text.`,
});

const generateSopFlow = ai.defineFlow(
  {
    name: 'generateSopFlow',
    inputSchema: GenerateSopInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await sopGenerationPrompt(input);
    return response.text;
  }
);
