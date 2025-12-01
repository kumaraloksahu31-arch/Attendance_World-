'use server';

import { generateAttendanceInsights } from "@/ai/flows/attendance-data-insights";
import { attendanceRecords } from "./data";

export async function getAttendanceInsightsAction() {
    try {
      const data = JSON.stringify(attendanceRecords);
      const result = await generateAttendanceInsights({ attendanceData: data });
      return { success: true, insights: result.insightsSummary };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Failed to generate insights.' };
    }
}
