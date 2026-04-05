
'use server';

import doctors from '@/lib/data/doctors.json';

export type Doctor = (typeof doctors)[0];

export async function getDoctors(): Promise<Doctor[]> {
  // =================================================================
  // == DATABASE INTEGRATION POINT
  // =================================================================
  // This is where you would fetch data from your actual database.
  //
  // 1. IMPORT your database client (e.g., Firebase, Supabase, Prisma).
  //    `import { db } from '@/lib/db';`
  //
  // 2. QUERY your database for the list of doctors.
  //    `const allDoctors = await db.collection('doctors').find().toArray();`
  //
  // 3. RETURN the data. Ensure it matches the `Doctor` type.
  //    `return allDoctors;`
  //
  // For now, we are returning the static JSON data as a placeholder.
  // =================================================================

  // Simulate a network delay, as a real database call would take time.
  await new Promise(resolve => setTimeout(resolve, 500));

  return doctors;
}
