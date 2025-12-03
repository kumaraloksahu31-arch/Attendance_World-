
'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Loader2 } from 'lucide-react';
import { DatePicker } from './date-picker';
import { Spreadsheet } from '@/app/components/dashboard/spreadsheet';
import { SheetTabs } from '@/app/components/dashboard/sheet-tabs';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { AttendanceSheet } from '@/app/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

type SpreadsheetDataType = {
  data: Record<string, string | boolean>;
  headers: string[];
  dateColumns: Date[];
  numRows: number;
};

export default function SheetDetailsPage() {
  const params = useParams();
  const sheetId = params.sheetId as string;
  const { user, loading: authLoading } = useAuth();
  const [sheet, setSheet] = useState<AttendanceSheet | null>(null);
  const [loading, setLoading] = useState(true);

  // State to hold spreadsheet data for export
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetDataType | null>(null);
  
  const handleDataChange = useCallback((data: SpreadsheetDataType) => {
    setSpreadsheetData(data);
  }, []);

  useEffect(() => {
    if (user && sheetId) {
      const getSheet = async () => {
        setLoading(true);
        try {
          const sheetRef = doc(db, `users/${user.uid}/sheets`, sheetId);
          const docSnap = await getDoc(sheetRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setSheet({ 
              id: docSnap.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
            } as AttendanceSheet);
          } else {
            notFound();
          }
        } catch (error) {
          console.error("Error fetching sheet:", error);
        } finally {
          setLoading(false);
        }
      };
      getSheet();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, sheetId, authLoading]);

  const getExportData = () => {
    if (!spreadsheetData) return { headers: [], rows: [] };

    const { data, headers, dateColumns, numRows } = spreadsheetData;
    const allHeaders = [...headers, ...dateColumns.map(d => format(d, 'd/MM/yy'))];
    
    const rows = Array.from({ length: numRows }, (_, rowIndex) => {
      // Only include rows that have at least one data point to avoid exporting empty rows
      const hasData = headers.some((_, colIndex) => !!data[`${colIndex}-${rowIndex + 1}`]) || dateColumns.some((_, dateIndex) => !!data[`date-${dateIndex}-${rowIndex + 1}`]);
      if (!hasData) return null;

      const row: (string | boolean)[] = [];
      headers.forEach((_, colIndex) => {
        row.push(data[`${colIndex}-${rowIndex + 1}`] || '');
      });
      dateColumns.forEach((_, dateIndex) => {
        row.push(data[`date-${dateIndex}-${rowIndex + 1}`] ? 'Present' : 'Absent');
      });
      return row;
    }).filter(Boolean) as (string | boolean)[][];

    return { headers: allHeaders, rows };
  }

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExport = (formatType: 'xlsx' | 'ods' | 'pdf' | 'html' | 'csv' | 'tsv') => {
    const { headers, rows } = getExportData();
    if (headers.length === 0 || rows.length === 0) {
      alert("No data to export.");
      return;
    }

    const title = sheet?.title || 'Attendance-Sheet';

    switch (formatType) {
      case 'csv': {
        const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
        downloadFile(csvContent, `${title}.csv`, 'text/csv;charset=utf-8;');
        break;
      }
      case 'tsv': {
        const tsvContent = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
        downloadFile(tsvContent, `${title}.tsv`, 'text/tab-separated-values;charset=utf-8;');
        break;
      }
       case 'html': {
        let html = `<html><head><title>${title}</title><style>table,th,td{border:1px solid black;border-collapse:collapse;padding:5px;}th{background-color:#f2f2f2;}</style></head><body><h1>${title}</h1><table><thead><tr>`;
        headers.forEach(h => html += `<th>${h}</th>`);
        html += '</tr></thead><tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => html += `<td>${cell}</td>`);
            html += '</tr>';
        });
        html += '</tbody></table></body></html>';
        downloadFile(html, `${title}.html`, 'text/html;charset=utf-8;');
        break;
      }
      case 'pdf': {
        const doc = new jsPDF();
        doc.text(title, 14, 16);
        autoTable(doc, {
          head: [headers],
          body: rows.map(row => row.map(String)), // Ensure all data is string for jspdf-autotable
          startY: 20,
        });
        doc.save(`${title}.pdf`);
        break;
      }
      case 'xlsx':
      case 'ods': {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, `${title}.${formatType}`);
        break;
      }
    }
  };

  if (loading || authLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!sheet) {
    return <div className="text-center py-10">Sheet not found or you do not have permission to view it.</div>;
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>Microsoft Excel (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('ods')}>OpenDocument (.ods)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF (.pdf)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')}>Web Page (.html)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>Comma Separated Values (.csv)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('tsv')}>Tab Separated Values (.tsv)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Spreadsheet sheet={sheet} onDataChange={handleDataChange} />
        </div>
      </div>
      
      <SheetTabs />
      
    </div>
  );
}
