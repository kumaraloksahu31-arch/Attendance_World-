'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { AttendanceSheet } from '@/app/lib/types';
import { users as initialUsers } from '@/app/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { AddSheetDialog } from '@/app/components/dashboard/add-sheet-dialog';
import { useAuth } from '@/hooks/use-auth';

export default function AttendanceSheetsPage() {
  const [sheets, setSheets] = useState<AttendanceSheet[]>([]);
  const [users] = useState(initialUsers);
  const { user } = useAuth();

  const handleAddSheet = (newSheet: Omit<AttendanceSheet, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'memberIds'>) => {
    if (!user) return; // Should not happen if page is protected

    const sheet: AttendanceSheet = {
      id: `sheet-${Date.now()}`,
      ...newSheet,
      createdBy: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      memberIds: [], // Start with no members
    };
    setSheets((prevSheets) => [sheet, ...prevSheets]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Attendance Sheets</h1>
            <p className="text-muted-foreground">
              Create and manage attendance for your classes and teams.
            </p>
          </div>
          <AddSheetDialog onAddSheet={handleAddSheet} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Sheets</CardTitle>
            <div className="w-full sm:w-auto sm:max-w-sm">
              <Input placeholder="Search sheets..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sheets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheets.map((sheet) => {
                const creator = users.find(u => u.id === sheet.createdBy);
                const creatorName = creator?.name || (user?.uid === sheet.createdBy ? user.displayName : 'Unknown');

                return (
                <TableRow key={sheet.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/attendance/${sheet.id}`} className="hover:underline">
                      {sheet.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sheet.type.charAt(0).toUpperCase() + sheet.type.slice(1)}</Badge>
                  </TableCell>
                  <TableCell>{sheet.memberIds.length}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDistanceToNow(sheet.createdAt, { addSuffix: true })}</span>
                      <span className="text-xs text-muted-foreground">by {creatorName || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href={`/dashboard/attendance/${sheet.id}`}>View</Link></DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold">No Sheets Found</h3>
              <p className="text-muted-foreground">Get started by creating a new attendance sheet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
