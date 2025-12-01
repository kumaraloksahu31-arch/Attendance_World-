import { sheets } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { DatePicker } from './date-picker';
import { Spreadsheet } from '@/app/components/dashboard/spreadsheet';
import { SheetTabs } from '@/app/components/dashboard/sheet-tabs';

export default function SheetDetailsPage({ params }: { params: { sheetId: string } }) {
  const sheet = sheets.find((s) => s.id === params.sheetId);

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
