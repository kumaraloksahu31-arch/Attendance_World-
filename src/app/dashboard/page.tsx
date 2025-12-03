
'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from '@/app/components/dashboard/stats-cards';
import { RecentSheets } from '@/app/components/dashboard/recent-sheets';
import { InsightsGenerator } from '@/app/components/dashboard/insights-generator';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import type { AttendanceSheet } from '@/app/lib/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const [stats, setStats] = useState([
    { title: 'Total Sheets', value: 0, change: '' },
    { title: 'Total Members', value: 0, change: '' },
    { title: 'Overall Attendance', value: '0%', change: '' },
    { title: 'Issues Detected', value: '0', change: '' },
  ]);

  const sheetsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/sheets`));
  }, [user, firestore]);

  const { data: sheets, loading: sheetsLoading } = useCollection<AttendanceSheet>(sheetsQuery);

  useEffect(() => {
    if (sheets) {
      const numSheets = sheets.length;
      const totalMembers = sheets.reduce((acc, sheet) => acc + (sheet.memberIds?.length || 0), 0);
      setStats(prevStats => [
        { ...prevStats[0], value: numSheets },
        { ...prevStats[1], value: totalMembers },
        prevStats[2],
        prevStats[3],
      ]);
    }
  }, [sheets]);

  const loading = authLoading || sheetsLoading;

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

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
