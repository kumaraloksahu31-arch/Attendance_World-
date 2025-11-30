import Link from 'next/link';
import { sheets, users } from '@/app/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export default function AttendanceSheetsPage() {
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
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Sheet
          </Button>
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
                      <span className="text-xs text-muted-foreground">by {creator?.name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
