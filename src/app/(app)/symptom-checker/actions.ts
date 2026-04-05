
'use server';

import { z } from 'zod';
import { symptomGuidance, SymptomGuidanceOutput } from '@/ai/flows/ai-symptom-guidance';

const SymptomCheckerSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in more detail.'),
  age: z.coerce.number().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  photoDataUri: z.string().optional(),
});

export type FormState = {
  message: string;
  guidance?: SymptomGuidanceOutput;
  isError: boolean;
};

export async function runSymptomChecker(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SymptomCheckerSchema.safeParse({
    symptoms: formData.get('symptoms'),
    age: formData.get('age'),
    gender: formData.get('gender'),
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.symptoms?.[0] || 'Invalid input.',
      isError: true,
    };
  }
  
  try {
    const result = await symptomGuidance(validatedFields.data);
    return {
      message: 'Guidance generated successfully.',
      guidance: result,
      isError: false,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred while analyzing your symptoms. Please try again.',
      isError: true,
    };
  }
}
