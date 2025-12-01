
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { AttendanceSheet } from '@/app/lib/types';

type EditSheetDialogProps = {
  sheet: AttendanceSheet;
  onUpdateSheet: (updatedSheet: AttendanceSheet) => void;
  onOpenChange: (open: boolean) => void;
};

export function EditSheetDialog({ sheet, onUpdateSheet, onOpenChange }: EditSheetDialogProps) {
  const [title, setTitle] = useState(sheet.title);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(sheet.title);
  }, [sheet]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Title cannot be empty.',
      });
      return;
    }
    
    onUpdateSheet({ ...sheet, title });
    
    toast({
      title: "Sheet Updated",
      description: "Your attendance sheet has been updated.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Sheet</DialogTitle>
            <DialogDescription>
              Update the details for your attendance sheet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input 
                id="title" 
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
