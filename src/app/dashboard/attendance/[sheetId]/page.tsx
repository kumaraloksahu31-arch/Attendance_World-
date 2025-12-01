
'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Loader2 } from 'lucide-react';
import { DatePicker } from './date-picker';
import { Spreadsheet } from '@/app/components/dashboard/spreadsheet';
import { SheetTabs } from '@/app/components/dashboard/sheet-tabs';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { AttendanceSheet } from '@/app/lib/types';


export default function SheetDetailsPage() {
  const params = useParams();
  const sheetId = params.sheetId as string;
  const { user, loading: authLoading } = useAuth();
  const [sheet, setSheet] = useState<AttendanceSheet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && sheetId) {
      const getSheet = async () => {
        try {
          const sheetRef = doc(db, `users/${user.uid}/sheets`, sheetId);
          const docSnap = await getDoc(sheetRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setSheet({ 
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
            } as AttendanceSheet);
          } else {
            notFound();
          }
        } catch (error) {
          console.error("Error fetching sheet:", error);
          // Handle error, maybe show a toast
        } finally {
          setLoading(false);
        }
      };
      getSheet();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, sheetId, authLoading]);

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!sheet) {
    // This will be handled by notFound() in useEffect, but as a fallback
    return <div className="text-center py-10">Sheet not found or you do not have permission to view it.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{sheet.title}</h1>
        <p className="text-muted-foreground">
          Manage attendance for {sheet.title}.
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
            <DatePicker />
        </div>
        <div className="flex items-center gap-2">
           <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Spreadsheet sheet={sheet} />
        </div>
      </div>
      
      <SheetTabs />
      
    </div>
  );
}
