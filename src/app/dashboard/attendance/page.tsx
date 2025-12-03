
'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
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
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { formatDistanceToNow, toDate } from 'date-fns';
import { Input } from '@/components/ui/input';
import { AddSheetDialog } from '@/app/components/dashboard/add-sheet-dialog';
import { EditSheetDialog } from '@/app/components/dashboard/edit-sheet-dialog';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export default function AttendanceSheetsPage() {
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [sheetToDelete, setSheetToDelete] = useState<string | null>(null);
  const [sheetToEdit, setSheetToEdit] = useState<AttendanceSheet | null>(null);

  const sheetsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/sheets`), orderBy('updatedAt', 'desc'));
  }, [user, firestore]);

  const { data: sheets, setData: setSheets, loading: sheetsLoading } = useCollection<AttendanceSheet>(sheetsQuery);

  const handleAddSheet = async (newSheet: Omit<AttendanceSheet, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'memberIds'>) => {
    if (!user || !firestore) return;
    try {
      const sheetsCollection = collection(firestore, `users/${user.uid}/sheets`);
      await addDoc(sheetsCollection, {
        ...newSheet,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        memberIds: [],
      });
      toast({
          title: "Sheet Created",
          description: "Your new attendance sheet has been created.",
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not create the sheet.",
      });
    }
  };
  
  const handleUpdateSheet = async (updatedSheetData: Partial<AttendanceSheet> & { id: string }) => {
    if (!user || !firestore) return;
    try {
        const sheetRef = doc(firestore, `users/${user.uid}/sheets`, updatedSheetData.id);
        await updateDoc(sheetRef, { 
            title: updatedSheetData.title,
            updatedAt: serverTimestamp(),
        });
        toast({
            title: "Sheet Updated",
            description: "The attendance sheet has been updated.",
        });
        setSheetToEdit(null);
    } catch(error) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update the sheet.',
        });
    }
  };

  const handleDelete = async (sheetId: string) => {
    if(!user || !firestore) return;
    try {
        const sheetRef = doc(firestore, `users/${user.uid}/sheets`, sheetId);
        await deleteDoc(sheetRef);
        toast({
          title: "Sheet Deleted",
          description: "The attendance sheet has been removed.",
        });
        setSheetToDelete(null);
    } catch(error){
         toast({
            variant: 'destructive',
            title: 'Delete Failed',
            description: 'Could not delete the sheet.',
        });
    }
  };

  const loading = authLoading || sheetsLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
            {sheets && sheets.length > 0 ? (
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
                    <TableCell>{sheet.memberIds?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDistanceToNow(sheet.updatedAt instanceof Date ? sheet.updatedAt : toDate(sheet.updatedAt), { addSuffix: true })}</span>
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
          onUpdateSheet={(updatedSheet) => handleUpdateSheet({ id: sheetToEdit.id, ...updatedSheet})} 
          onOpenChange={() => setSheetToEdit(null)}
        />
      )}

      <AlertDialog open={!!sheetToDelete} onOpenChange={(open) => !open && setSheetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              attendance sheet and all of its data from Firestore.
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
