
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { AttendanceSheet } from '@/app/lib/types';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { AddSheetDialog } from '@/app/components/dashboard/add-sheet-dialog';
import { EditSheetDialog } from '@/app/components/dashboard/edit-sheet-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'attendance-sheets';

export default function AttendanceSheetsPage() {
  const [sheets, setSheets] = useState<AttendanceSheet[]>([]);
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const [sheetToDelete, setSheetToDelete] = useState<string | null>(null);
  const [sheetToEdit, setSheetToEdit] = useState<AttendanceSheet | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedSheets = localStorage.getItem(STORAGE_KEY);
      if (storedSheets) {
        setSheets(JSON.parse(storedSheets, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        }));
      }
    } catch (error) {
      console.error("Failed to parse sheets from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets));
    }
  }, [sheets, isMounted]);

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
  
  const handleUpdateSheet = (updatedSheet: AttendanceSheet) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === updatedSheet.id ? { ...updatedSheet, updatedAt: new Date() } : sheet
      )
    );
    setSheetToEdit(null);
  };

  const handleDelete = (sheetId: string) => {
    setSheets(prevSheets => prevSheets.filter(sheet => sheet.id !== sheetId));
    toast({
      title: "Sheet Deleted",
      description: "The attendance sheet has been removed.",
    });
    setSheetToDelete(null);
  };

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  return (
    <>
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
                  <TableHead>Last Updated</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sheets.map((sheet) => {
                  const creatorName = user?.uid === sheet.createdBy ? user.displayName : 'Unknown';

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
                        <span>{formatDistanceToNow(sheet.updatedAt, { addSuffix: true })}</span>
                        <span className="text-xs text-muted-foreground">by {creatorName || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link href={`/dashboard/attendance/${sheet.id}`}>View</Link></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSheetToEdit(sheet)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setSheetToDelete(sheet.id)}
                           >
                             Delete
                           </DropdownMenuItem>
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

      {sheetToEdit && (
        <EditSheetDialog 
          sheet={sheetToEdit} 
          onUpdateSheet={handleUpdateSheet} 
          onOpenChange={() => setSheetToEdit(null)}
        />
      )}

      <AlertDialog open={!!sheetToDelete} onOpenChange={(open) => !open && setSheetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              attendance sheet and all of its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sheetToDelete && handleDelete(sheetToDelete)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
