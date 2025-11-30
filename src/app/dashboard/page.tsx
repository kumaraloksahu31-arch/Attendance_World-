import { StatsCards } from '@/app/components/dashboard/stats-cards';
import { RecentSheets } from '@/app/components/dashboard/recent-sheets';
import { InsightsGenerator } from '@/app/components/dashboard/insights-generator';
import { users, sheets } from '@/app/lib/data';

// Mock user role
const userRole = 'admin'; // 'admin', 'employee', or 'student'

export default function DashboardPage() {
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalEmployees = users.filter((u) => u.role === 'employee').length;

  const stats = {
    admin: [
      { title: 'Total Sheets', value: sheets.length, change: '+2 this month' },
      { title: 'Total Students', value: totalStudents, change: '+5 new' },
      { title: 'Total Employees', value: totalEmployees, change: '-1 left' },
      { title: 'Pending Approvals', value: '3', change: '' },
    ],
    employee: [
      { title: 'Attendance', value: '98%', change: '+0.5% from last month' },
      { title: 'Days Worked', value: '21', change: 'in July' },
      { title: 'Late Marks', value: '1', change: 'this month' },
      { title: 'Leaves Taken', value: '2', change: 'this quarter' },
    ],
    student: [
      { title: 'Attendance', value: '95%', change: '-1.2% from last month' },
      { title: 'Classes Attended', value: '58', change: 'in July' },
      { title: 'Absences', value: '3', change: 'this month' },
      { title: 'Late Marks', value: '2', change: 'this month' },
    ],
  };

  const currentStats = stats[userRole as keyof typeof stats] || stats.student;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your attendance overview.
        </p>
      </div>
      <StatsCards stats={currentStats} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentSheets />
        </div>
        {userRole === 'admin' && (
          <div>
            <InsightsGenerator />
          </div>
        )}
      </div>
    </div>
  );
}
