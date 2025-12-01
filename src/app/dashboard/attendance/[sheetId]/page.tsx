import { sheets } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { AttendanceTable } from '@/app/components/dashboard/attendance-table';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DatePicker } from './date-picker';


export default function SheetDetailsPage({ params }: { params: { sheetId: string } }) {
  const sheet = sheets.find((s) => s.id === params.sheetId);

  if (!sheet) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{sheet.title}</h1>
        <p className="text-muted-foreground">
          Manage attendance for {sheet.title}. View: {sheet.view}
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
            <DatePicker />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Present</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Absent</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Late</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Leave</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <AttendanceTable sheet={sheet} />
    </div>
  );
}
