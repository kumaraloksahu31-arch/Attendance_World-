'use client';

import { users, attendanceRecords } from '@/app/lib/data';
import type { AttendanceSheet } from '@/app/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

type AttendanceTableProps = {
  sheet: AttendanceSheet;
};

export function AttendanceTable({ sheet }: AttendanceTableProps) {
  const sheetMembers = users.filter((u) => sheet.memberIds.includes(u.id));
  const todayRecords = attendanceRecords.filter(
    (r) => r.sheetId === sheet.id && new Date(r.date).toDateString() === new Date().toDateString()
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] px-4">
                  <Checkbox />
                </TableHead>
                <TableHead className="min-w-[250px]">Name</TableHead>
                <TableHead>Status (Today)</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetMembers.map((member) => {
                const record = todayRecords.find((r) => r.userId === member.id);
                const status = record?.status || 'present';

                return (
                  <TableRow key={member.id}>
                    <TableCell className="px-4"><Checkbox /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={status}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="leave">Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                        <Button variant="link" size="sm" className="px-0">Add Note</Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View Log</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
