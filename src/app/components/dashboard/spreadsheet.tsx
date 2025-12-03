
'use client';

import type { AttendanceSheet } from '@/app/lib/types';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { addDays, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, GripVertical } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type SpreadsheetDataType = {
  data: Record<string, string | boolean>;
  headers: string[];
  dateColumns: Date[];
  numRows: number;
};

type SpreadsheetProps = {
  sheet: AttendanceSheet;
  onDataChange: (data: SpreadsheetDataType) => void;
};

const INITIAL_COLS = 3;
const INITIAL_ROWS = 50;

const defaultHeaders = ["Name", "Phone number", "Techxera ID"];

export function Spreadsheet({ sheet, onDataChange }: SpreadsheetProps) {
  const [data, setData] = useState<Record<string, string | boolean>>({});
  const [numRows, setNumRows] = useState(INITIAL_ROWS);
  const [dateCols, setDateCols] = useState(INITIAL_COLS);
  const [headers, setHeaders] = useState<string[]>(defaultHeaders);
  const headerInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const today = useMemo(() => new Date(), []);
  const dateColumns = useMemo(() => {
    return Array.from({ length: dateCols }, (_, i) => addDays(today, i));
  }, [today, dateCols]);

  const rows = useMemo(() => {
    return Array.from({ length: numRows }, (_, i) => i + 1);
  }, [numRows]);
  
  useEffect(() => {
    onDataChange({ data, headers, dateColumns, numRows });
  }, [data, headers, dateColumns, numRows, onDataChange]);


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
    const newData = { ...data };
    // This is a simplified delete, a more robust implementation would shift rows up.
    // For now, we clear the data and reduce the row count if it's the last one.
    for (let i = 0; i < headers.length; i++) {
        delete newData[`${i}-${rowIndex}`];
    }
    for (let i = 0; i < dateCols; i++) {
        delete newData[`date-${i}-${rowIndex}`];
    }
    setData(newData);
    if (numRows > 1 && rowIndex === numRows) {
        setNumRows(prev => prev -1);
    }
  };

  const handleDeleteCol = (colIndex: number) => {
    if (colIndex < headers.length) {
        setHeaders(prev => prev.filter((_, i) => i !== colIndex));
    } else {
        const dateColIndex = colIndex - headers.length;
        if(dateColIndex < dateCols) {
            setDateCols(prev => prev > 0 ? prev -1 : 0);
        }
    }
  };

  const handleEditHeader = (index: number) => {
    headerInputRefs.current[index]?.focus();
    headerInputRefs.current[index]?.select();
  };

  return (
    <div className="flex-1 overflow-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border-collapse">
        <thead className="bg-blue-600 sticky top-0 z-10">
          <tr>
            <th className="sticky left-0 bg-blue-600 w-16 px-2 py-2 text-center text-xs font-medium text-white uppercase tracking-wider"></th>
            {headers.map((header, index) => (
              <th 
                key={`header-${index}`}
                className="w-48 px-1 py-1 text-left text-xs font-medium text-white uppercase tracking-wider group"
              >
                <ContextMenu>
                    <ContextMenuTrigger className="flex items-center justify-between w-full">
                         <input
                          ref={el => headerInputRefs.current[index] = el}
                          type="text"
                          value={header}
                          onChange={(e) => handleHeaderChange(index, e.target.value)}
                          className="w-full bg-transparent p-1 focus:outline-none focus:ring-1 focus:ring-white rounded-sm"
                        />
                        <GripVertical className="h-4 w-4 text-blue-300 cursor-grab" />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem onClick={() => handleEditHeader(index)}>
                            <Edit className="mr-2 h-4 w-4" /> Rename Column
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem className="text-destructive" onClick={() => handleDeleteCol(index)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Column
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
              </th>
            ))}
            {dateColumns.map((date, index) => (
              <th 
                key={date.toISOString()} 
                className="w-24 px-1 py-1 text-center text-xs font-medium text-white uppercase tracking-wider group"
              >
                 <ContextMenu>
                    <ContextMenuTrigger className="flex items-center justify-center w-full">
                        {format(date, 'd/MM')}
                        <GripVertical className="h-4 w-4 text-blue-300 cursor-grab ml-2" />
                    </ContextMenuTrigger>
                     <ContextMenuContent>
                        <ContextMenuItem className="text-destructive" onClick={() => handleDeleteCol(headers.length + index)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Column
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
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
              <td className="sticky left-0 w-16 px-2 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
                <ContextMenu>
                    <ContextMenuTrigger className="flex items-center justify-center h-full w-full">
                      <span>{row}</span>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem className="text-destructive" onClick={() => handleDeleteRow(row)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Row
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
              </td>
              {headers.map((_header, colIndex) => (
                <td key={`${colIndex}-${row}`} className="border border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    className="w-full h-full p-2 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary focus:bg-blue-50 dark:focus:bg-blue-900/20"
                    aria-label={`Cell for ${headers[colIndex]} row ${row}`}
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
                <td colSpan={headers.length + dateCols + 1}></td>
            </tr>
        </tbody>
      </table>
    </div>
  );
}
