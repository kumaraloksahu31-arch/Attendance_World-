
'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase } from '@/hooks/use-firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import type { AttendanceSheet } from '@/app/lib/types';
import { toDate } from 'date-fns';


export function RecentSheets() {
    const { user, loading: authLoading } = useAuth();
    const { db } = useFirebase();
    const [sheets, setSheets] = useState<AttendanceSheet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && db) {
        const fetchSheets = async () => {
            try {
            const sheetsCollection = collection(db, `users/${user.uid}/sheets`);
            const q = query(sheetsCollection, orderBy('updatedAt', 'desc'), limit(5));
            const querySnapshot = await getDocs(q);
            const sheetsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                } as AttendanceSheet
            });
            setSheets(sheetsData);
            } catch (error) {
            console.error("Failed to fetch recent sheets from Firestore", error);
            } finally {
            setLoading(false);
            }
        };
        fetchSheets();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading, db]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle className="font-headline">Recent Attendance Sheets</CardTitle>
          <CardDescription>
            A list of your most recently updated sheets.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/dashboard/attendance">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading || authLoading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : sheets.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                <TableHead className="text-right">View</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sheets.map((sheet) => (
                <TableRow key={sheet.id}>
                    <TableCell>
                    <div className="font-medium">{sheet.title}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                    <Badge variant={sheet.type === 'student' ? 'secondary' : 'outline'}>
                        {sheet.type.charAt(0).toUpperCase() + sheet.type.slice(1)}
                    </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                     {format(sheet.updatedAt instanceof Date ? sheet.updatedAt : toDate(sheet.updatedAt), 'PPP')}
                    </TableCell>
                    <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/attendance/${sheet.id}`}>Manage</Link>
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
            <div className="text-center py-10">
                <h3 className="text-lg font-semibold">No Sheets Found</h3>
                <p className="text-muted-foreground">You have not created any attendance sheets yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
