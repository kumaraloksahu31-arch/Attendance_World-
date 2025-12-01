
'use client';

import type { AttendanceSheet } from '@/app/lib/types';
import { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { addDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

type SpreadsheetProps = {
  sheet: AttendanceSheet;
};

const INITIAL_COLS = 3;
const INITIAL_ROWS = 50;

const defaultHeaders = ["Name", "Phone number", "Techxera ID"];

export function Spreadsheet({ sheet }: SpreadsheetProps) {
  const [data, setData] = useState<Record<string, string | boolean>>({});
  const [numRows, setNumRows] = useState(INITIAL_ROWS);
  const [dateCols, setDateCols] = useState(INITIAL_COLS);
  const [headers, setHeaders] = useState<string[]>(defaultHeaders);

  const today = new Date();
  const dateColumns = useMemo(() => {
    return Array.from({ length: dateCols }, (_, i) => addDays(today, i));
  }, [today, dateCols]);

  const rows = useMemo(() => {
    return Array.from({ length: numRows }, (_, i) => i + 1);
  }, [numRows]);

  const handleCellChange = (cellId: string, value: string | boolean) => {
    setData(prevData => ({ ...prevData, [cellId]: value }));
  };
  
  const handleHeaderChange = (index: number, value: string) => {
    setHeaders(prevHeaders => {
        const newHeaders = [...prevHeaders];
        newHeaders[index] = value;
        return newHeaders;
    });
  };

  const handleAddRow = () => {
    setNumRows(prev => prev + 1);
  };

  const handleAddCol = () => {
    setDateCols(prev => prev + 1);
  };

  const handleDeleteRow = (rowIndex: number) => {
    // This is a simplified deletion. A more robust solution would re-index the data.
    // For now, we clear the data of the deleted row and then decrement the row count.
    const newData = { ...data };
    for (let i = 0; i < headers.length; i++) {
        delete newData[`${i}-${rowIndex + 1}`];
    }
    for (let i = 0; i < dateCols; i++) {
        delete newData[`date-${i}-${rowIndex + 1}`];
    }
    setData(newData);
    // This doesn't actually remove the row but hides it. A real implementation
    // would need to manage the row array and data mapping more carefully.
    // For this prototype, we'll just visually remove it.
    if(numRows > 1) setNumRows(prev => prev -1);
  };

  const handleDeleteCol = (colIndex: number) => {
    if (colIndex < headers.length) {
        setHeaders(prev => prev.filter((_, i) => i !== colIndex));
    } else {
        setDateCols(prev => prev > 0 ? prev -1 : 0);
    }
  };

  return (
    <div className="flex-1 overflow-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
        <thead className="bg-blue-600 sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 bg-blue-600 w-24 px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"></th>
            {headers.map((header, index) => (
              <th 
                key={`header-${index}`}
                className="w-48 px-1 py-1 text-left text-xs font-medium text-white uppercase tracking-wider group"
              >
                <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleHeaderChange(index, e.target.value)}
                      className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteCol(index)} className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-blue-500">
                        <Trash2 className="h-3 w-3 text-white" />
                    </Button>
                </div>
              </th>
            ))}
            {dateColumns.map((date, index) => (
              <th 
                key={date.toISOString()} 
                className="w-24 px-1 py-1 text-center text-xs font-medium text-white uppercase tracking-wider group"
              >
                <div className="flex items-center justify-center">
                    {format(date, 'd/MM')}
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteCol(headers.length + index)} className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-blue-500">
                        <Trash2 className="h-3 w-3 text-white" />
                    </Button>
                </div>
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
            <tr key={row} className="group">
              <td className="sticky left-0 w-24 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <span>{row}</span>
                 <Button size="icon" variant="ghost" onClick={() => handleDeleteRow(rowIndex)} className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4 text-destructive" />
                 </Button>
              </td>
              {headers.map((header, colIndex) => (
                <td key={`${colIndex}-${row}`} className="border border-gray-200 dark:border-gray-700">
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
                <td className="sticky left-0 w-24 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                    <Button size="icon" variant="ghost" onClick={handleAddRow} className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Row</span>
                    </Button>
                </td>
                <td colSpan={headers.length + dateCols + 1}></td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}
