
'use client';

import type { AttendanceSheet } from '@/app/lib/types';
import { useMemo, useState } from 'react';

type SpreadsheetProps = {
  sheet: AttendanceSheet;
};

const COLS = 26; // A-Z
const ROWS = 50;

export function Spreadsheet({ sheet }: SpreadsheetProps) {
  const [data, setData] = useState<Record<string, string>>({});

  const columns = useMemo(() => {
    return Array.from({ length: COLS }, (_, i) => String.fromCharCode(65 + i));
  }, []);

  const rows = useMemo(() => {
    return Array.from({ length: ROWS }, (_, i) => i + 1);
  }, []);

  const handleCellChange = (row: number, col: string, value: string) => {
    const cellId = `${col}${row}`;
    setData(prevData => ({ ...prevData, [cellId]: value }));
  };

  return (
    <div className="flex-1 overflow-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 bg-gray-50 dark:bg-gray-800 w-16 px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            {columns.map(col => (
              <th 
                key={col} 
                className="w-32 px-6 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map(row => (
            <tr key={row}>
              <td className="sticky left-0 bg-gray-50 dark:bg-gray-800 w-16 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300">
                {row}
              </td>
              {columns.map(col => (
                <td key={`${col}${row}`} className="border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    className="w-full h-full p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-blue-50 dark:focus:bg-blue-900/20"
                    aria-label={`Cell ${col}${row}`}
                    value={data[`${col}${row}`] || ''}
                    onChange={(e) => handleCellChange(row, col, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
