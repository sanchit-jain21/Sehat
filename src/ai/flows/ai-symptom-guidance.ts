
'use server';

/**
 * @fileOverview An AI-powered symptom checker flow that provides preliminary guidance based on user-provided symptoms and an optional photo.
 *
 * - symptomGuidance - A function that takes symptom descriptions and returns preliminary guidance.
 * - SymptomGuidanceInput - The input type for the symptomGuidance function.
 * - SymptomGuidanceOutput - The return type for the symptomGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomGuidanceInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the symptoms experienced by the user.'),
  age: z.number().optional().describe('The age of the user in years.'),
  gender: z.enum(['male', 'female', 'other']).optional().describe('The gender of the user.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the injury or affected area, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SymptomGuidanceInput = z.infer<typeof SymptomGuidanceInputSchema>;

const SymptomGuidanceOutputSchema = z.object({
  potentialConditions: z.array(z.object({
    condition: z.string().describe('The name of the potential medical condition.'),
    likelihood: z.enum(['high', 'medium', 'low']).describe('The likelihood of this condition based on the symptoms.'),
    explanation: z.string().describe('A brief explanation of why this condition is considered.'),
  })).describe('A list of potential conditions that could be causing the symptoms.'),
  severity: z.enum(['mild', 'moderate', 'severe', 'emergency']).describe('The overall severity assessment of the reported symptoms.'),
  recommendation: z.string().describe('Recommended next steps for the user, such as home care, seeing a doctor, or seeking immediate medical attention.'),
  disclaimer: z.string().describe('A clear disclaimer that this is not a medical diagnosis.'),
});
export type SymptomGuidanceOutput = z.infer<typeof SymptomGuidanceOutputSchema>;

export async function symptomGuidance(input: SymptomGuidanceInput): Promise<SymptomGuidanceOutput> {
  return symptomGuidanceFlow(input);
}

const symptomGuidancePrompt = ai.definePrompt({
  name: 'symptomGuidancePrompt',
  input: {schema: SymptomGuidanceInputSchema},
  output: {schema: SymptomGuidanceOutputSchema},
  prompt: `You are a highly knowledgeable and cautious AI medical assistant. Your purpose is to provide preliminary, non-diagnostic guidance based on user-reported symptoms and images. You are not a substitute for a real doctor.

  Analyze the user's symptoms, age, gender, and any provided photo to formulate a helpful response. Here is your thinking process:
  1.  **Symptom & Image Analysis**: Break down the user's description. Identify key symptoms. If a photo is provided, analyze it for visible signs (e.g., rash, swelling, discoloration, injury characteristics).
  2.  **Differential Diagnosis Simulation**: Based on all available information, generate a broad list of possible conditions. Include common ailments, less common but plausible conditions, and important-not-to-miss major diseases.
  3.  **Refine and Rank**: Evaluate the list against the user's full context. Select the top 2-3 most relevant potential conditions. For each, determine a likelihood (high, medium, low) and write a clear, concise explanation.
  4.  **Severity Assessment**: Judge the overall severity. If symptoms or visible signs suggest an emergency (e.g., severe bleeding, major trauma, severe chest pain, difficulty breathing, stroke signs), you MUST classify the severity as 'emergency'.
  5.  **Actionable Recommendation**: Provide clear, safe, and actionable next steps related to the severity. For 'emergency', always recommend seeking immediate medical attention.
  6.  **Disclaimer**: ALWAYS conclude with a strong disclaimer that this is not a medical diagnosis and consulting a healthcare professional is essential.

  Your final output must strictly follow the defined JSON schema.

  User Information:
  Symptoms: {{{symptoms}}}
  {{#if age}}
  Age: {{{age}}}
  {{/if}}
  {{#if gender}}
  Gender: {{{gender}}}
  {{/if}}
  {{#if photoDataUri}}
  Photo: {{media url=photoDataUri}}
  {{/if}}
  `,
});

const symptomGuidanceFlow = ai.defineFlow(
  {
    name: 'symptomGuidanceFlow',
    inputSchema: SymptomGuidanceInputSchema,
    outputSchema: SymptomGuidanceOutputSchema,
  },
  async input => {
    const {output} = await symptomGuidancePrompt(input);
    return output!;
  }
);
