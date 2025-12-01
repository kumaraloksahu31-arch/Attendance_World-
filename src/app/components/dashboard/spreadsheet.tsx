
'use client';

import type { AttendanceSheet } from '@/app/lib/types';
import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { addDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type SpreadsheetProps = {
  sheet: AttendanceSheet;
};

const INITIAL_COLS = 30;
const INITIAL_ROWS = 50;

export function Spreadsheet({ sheet }: SpreadsheetProps) {
  const [data, setData] = useState<Record<string, string | boolean>>({});
  const [numRows, setNumRows] = useState(INITIAL_ROWS);
  const [numCols, setNumCols] = useState(INITIAL_COLS);

  const today = new Date();
  const dateColumns = useMemo(() => {
    return Array.from({ length: numCols }, (_, i) => addDays(today, i));
  }, [today, numCols]);

  const rows = useMemo(() => {
    return Array.from({ length: numRows }, (_, i) => i + 1);
  }, [numRows]);

  const handleCellChange = (cellId: string, value: string | boolean) => {
    setData(prevData => ({ ...prevData, [cellId]: value }));
  };

  const handleAddRow = () => {
    setNumRows(prev => prev + 1);
  };

  const handleAddCol = () => {
    setNumCols(prev => prev + 1);
  };

  const staticHeaders = ["Name", "Phone number", "Techxera ID"];

  return (
    <div className="flex-1 overflow-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
        <thead className="bg-blue-600 sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 bg-blue-600 w-16 px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"></th>
            {staticHeaders.map(header => (
              <th 
                key={header} 
                className="w-48 px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
            {dateColumns.map(date => (
              <th 
                key={date.toISOString()} 
                className="w-24 px-6 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                {format(date, 'd/MM')}
              </th>
            ))}
             <th className="w-12 px-2 py-2 text-center">
                <Button size="icon" variant="ghost" onClick={handleAddCol} className="h-8 w-8 hover:bg-blue-500">
                    <Plus className="h-4 w-4 text-white" />
                    <span className="sr-only">Add Column</span>
                </Button>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <tr key={row} className={rowIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/20' : ''}>
              <td className="sticky left-0 w-16 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                {row}
              </td>
              {staticHeaders.map((header, colIndex) => (
                <td key={`${header}-${row}`} className="border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    className="w-full h-full p-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:bg-blue-50 dark:focus:bg-blue-900/20"
                    aria-label={`Cell for ${header} row ${row}`}
                    value={(data[`${colIndex}-${row}`] as string) || ''}
                    onChange={(e) => handleCellChange(`${colIndex}-${row}`, e.target.value)}
                  />
                </td>
              ))}
              {dateColumns.map((date, dateIndex) => {
                const cellId = `date-${dateIndex}-${row}`;
                return (
                  <td key={cellId} className="border border-gray-200 dark:border-gray-700 text-center">
                    <div className="flex items-center justify-center h-full">
                       <Checkbox
                        id={cellId}
                        checked={!!data[cellId]}
                        onCheckedChange={(checked) => handleCellChange(cellId, checked as boolean)}
                        aria-label={`Attendance for ${format(date, 'PPP')} row ${row}`}
                      />
                    </div>
                  </td>
                );
              })}
              <td className="w-12"></td>
            </tr>
          ))}
           <tr>
                <td className="sticky left-0 w-16 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                    <Button size="icon" variant="ghost" onClick={handleAddRow} className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Row</span>
                    </Button>
                </td>
                <td colSpan={staticHeaders.length + numCols + 1}></td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}
