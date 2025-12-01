import { StatsCards } from '@/app/components/dashboard/stats-cards';
import { RecentSheets } from '@/app/components/dashboard/recent-sheets';
import { InsightsGenerator } from '@/app/components/dashboard/insights-generator';
import { users, sheets } from '@/app/lib/data';
import { notFound } from 'next/navigation';

const stats = [
  {
    title: 'Total Sheets',
    value: sheets.length,
    change: '+2 this month',
  },
  {
    title: 'Total Members',
    value: users.length,
    change: '+10 this month',
  },
  {
    title: 'Overall Attendance',
    value: '94.5%',
    change: '+1.2% from last month',
  },
  {
    title: 'Issues Detected',
    value: '3',
    change: '2 new issues',
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
