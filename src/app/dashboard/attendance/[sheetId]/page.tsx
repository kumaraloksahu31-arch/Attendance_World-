import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { DatePicker } from './date-picker';
import { Spreadsheet } from '@/app/components/dashboard/spreadsheet';
import { SheetTabs } from '@/app/components/dashboard/sheet-tabs';

// This is a server component, so we can't use hooks like useState or useEffect here.
// We also can't directly access localStorage.
// For now, we will simulate fetching the sheet data.

async function getSheet(sheetId: string) {
  // In a real app, you would fetch this from a database or API.
  // We can't use localStorage on the server.
  // This function simulates that by returning a dummy sheet.
  // The actual sheets are managed on the client in the /dashboard/attendance page.
  if (sheetId) {
    return {
      id: sheetId,
      title: `Sheet ${sheetId.split('-')[1]}`,
      type: 'student' as const,
      view: 'monthly' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user-1',
      memberIds: [],
    };
  }
  return null;
}


export default async function SheetDetailsPage({ params }: { params: { sheetId: string } }) {
  const sheet = await getSheet(params.sheetId);

  if (!sheet) {
    notFound();
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

      <div className="flex-1 flex flex-col">
        <Spreadsheet sheet={sheet} />
      </div>
      
      <SheetTabs />
      
    </div>
  );
}
