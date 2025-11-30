'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating attendance data insights.
 *
 * - generateAttendanceInsights - A function that generates a summary of key insights about attendance data.
 * - AttendanceInsightsInput - The input type for the generateAttendanceInsights function.
 * - AttendanceInsightsOutput - The return type for the generateAttendanceInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceInsightsInputSchema = z.object({
  attendanceData: z.string().describe('A JSON string containing all attendance data.'),
});
export type AttendanceInsightsInput = z.infer<typeof AttendanceInsightsInputSchema>;

const AttendanceInsightsOutputSchema = z.object({
  insightsSummary: z.string().describe('A summary of key insights about the attendance data.'),
});
export type AttendanceInsightsOutput = z.infer<typeof AttendanceInsightsOutputSchema>;

export async function generateAttendanceInsights(input: AttendanceInsightsInput): Promise<AttendanceInsightsOutput> {
  return attendanceInsightsFlow(input);
}

const attendanceInsightsPrompt = ai.definePrompt({
  name: 'attendanceInsightsPrompt',
  input: {schema: AttendanceInsightsInputSchema},
  output: {schema: AttendanceInsightsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing key insights from attendance data.

  Analyze the provided attendance data and identify trends, potential issues, and overall attendance patterns.
  Provide a concise summary of your findings.

  Attendance Data: {{{attendanceData}}}
  `,
});

const attendanceInsightsFlow = ai.defineFlow(
  {
    name: 'attendanceInsightsFlow',
    inputSchema: AttendanceInsightsInputSchema,
    outputSchema: AttendanceInsightsOutputSchema,
  },
  async input => {
    const {output} = await attendanceInsightsPrompt(input);
    return output!;
  }
);
