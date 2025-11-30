'use server';

import { generateAttendanceInsights } from '@/ai/flows/attendance-data-insights';
import { attendanceRecords } from '@/app/lib/data';

export async function getAttendanceInsightsAction() {
  try {
    const insights = await generateAttendanceInsights({
      attendanceData: JSON.stringify(attendanceRecords),
    });
    return { success: true, insights: insights.insightsSummary };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate insights.' };
  }
}
