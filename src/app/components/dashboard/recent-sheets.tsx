
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
import { format, toDate } from 'date-fns';
import { useUser, useCollection, useFirestore } from '@/firebase';
import type { AttendanceSheet } from '@/app/lib/types';
import { useMemo } from 'react';
import { collection, query, orderBy, limit } from 'firebase/firestore';


export function RecentSheets() {
    const { user, loading: authLoading } = useUser();
    const firestore = useFirestore();
    
    const sheetsQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/sheets`),
            orderBy('updatedAt', 'desc'),
            limit(5)
        );
    }, [user, firestore]);

    const { data: sheets, loading: sheetsLoading } = useCollection<AttendanceSheet>(sheetsQuery);

    const loading = authLoading || sheetsLoading;

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
        {loading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : sheets && sheets.length > 0 ? (
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
