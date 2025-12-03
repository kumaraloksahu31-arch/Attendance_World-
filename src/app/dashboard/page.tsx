
'use client';

import { useState, useEffect } from 'react';
import { StatsCards } from '@/app/components/dashboard/stats-cards';
import { RecentSheets } from '@/app/components/dashboard/recent-sheets';
import { InsightsGenerator } from '@/app/components/dashboard/insights-generator';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState([
    { title: 'Total Sheets', value: 0, change: '' },
    { title: 'Total Members', value: 0, change: '' },
    { title: 'Overall Attendance', value: '0%', change: '' },
    { title: 'Issues Detected', value: '0', change: '' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && db) {
      const fetchDashboardData = async () => {
        try {
          const sheetsRef = collection(db, `users/${user.uid}/sheets`);
          const sheetsSnapshot = await getDocs(sheetsRef);
          const numSheets = sheetsSnapshot.size;
          
          let totalMembers = 0;
          sheetsSnapshot.docs.forEach(doc => {
            totalMembers += (doc.data().memberIds || []).length;
          });

          setStats(prevStats => [
            { ...prevStats[0], value: numSheets },
            { ...prevStats[1], value: totalMembers },
            // Keeping attendance and issues static for now
            prevStats[2],
            prevStats[3],
          ]);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
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
