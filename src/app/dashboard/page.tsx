

import { StatsCards } from '@/app/components/dashboard/stats-cards';
import { RecentSheets } from '@/app/components/dashboard/recent-sheets';
import { InsightsGenerator } from '@/app/components/dashboard/insights-generator';
import { users, sheets } from '@/app/lib/data';

const stats = [
  {
    title: 'Total Sheets',
    value: 0,
    change: '',
  },
  {
    title: 'Total Members',
    value: 0,
    change: '',
  },
  {
    title: 'Overall Attendance',
    value: '0%',
    change: '',
  },
  {
    title: 'Issues Detected',
    value: '0',
    change: '',
  },
];

export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your attendance data.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentSheets />
        </div>
        <div className="lg:col-span-1">
          <InsightsGenerator />
        </div>
      </div>
    </div>
  );
}
