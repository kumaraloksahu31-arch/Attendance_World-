
'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Loader2 } from 'lucide-react';
import { DatePicker } from './date-picker';
import { Spreadsheet, type SpreadsheetHandle } from '@/app/components/dashboard/spreadsheet';
import { SheetTabs } from '@/app/components/dashboard/sheet-tabs';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase } from '@/hooks/use-firebase';
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

export default function SheetDetailsPage() {
  const params = useParams();
  const sheetId = params.sheetId as string;
  const { user, loading: authLoading } = useAuth();
  const { db } = useFirebase();
  const [sheet, setSheet] = useState<AttendanceSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const spreadsheetRef = useRef<SpreadsheetHandle>(null);

  useEffect(() => {
    if (user && sheetId && db) {
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
  }, [user, sheetId, authLoading, db]);

  const getExportData = () => {
    if (!spreadsheetRef.current) return { headers: [], rows: [] };

    const spreadsheetData = spreadsheetRef.current.getSpreadsheetData();
    const { data, headers, dateColumns, numRows } = spreadsheetData;
    const allHeaders = [...headers, ...dateColumns.map(d => format(d, 'd/MM/yy'))];
    
    const outputRows = [];

    for (let rowIndex = 1; rowIndex <= numRows; rowIndex++) {
        let hasData = false;
        const rowData = [];

        // Get text input values
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
            const cellValue = (data[`${colIndex}-${rowIndex}`] as string) || '';
            if (cellValue) hasData = true;
            rowData.push(cellValue);
        }

        // Get checkbox values
        for (let dateIndex = 0; dateIndex < dateColumns.length; dateIndex++) {
            const cellValue = !!data[`date-${dateIndex}-${rowIndex}`];
            if (cellValue) hasData = true; // A checkbox being checked counts as data
            rowData.push(cellValue ? 'Present' : 'Absent');
        }

        if (hasData) {
            outputRows.push(rowData);
        }
    }

    return { headers: allHeaders, rows: outputRows };
  }

  const downloadFile = (content: Blob, fileName: string) => {
    const a = document.createElement("a");
    const url = URL.createObjectURL(content);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
  };

  const handleExport = (formatType: 'xlsx' | 'ods' | 'pdf' | 'html' | 'csv' | 'tsv') => {
    const { headers, rows } = getExportData();
    if (rows.length === 0) {
      alert("There is no data in the sheet to export.");
      return;
    }

    const title = sheet?.title || 'Attendance-Sheet';

    switch (formatType) {
      case 'csv': {
        const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        downloadFile(blob, `${title}.csv`);
        break;
      }
      case 'tsv': {
        const tsvContent = [headers.join('\t'), ...rows.map(row => row.join('\t'))].join('\n');
        const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
        downloadFile(blob, `${title}.tsv`);
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
        const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
        downloadFile(blob, `${title}.html`);
        break;
      }
      case 'pdf': {
        const doc = new jsPDF();
        doc.text(title, 14, 16);
        autoTable(doc, {
          head: [headers],
          body: rows.map(row => row.map(String)),
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
          <Spreadsheet ref={spreadsheetRef} sheet={sheet} />
        </div>
      </div>
      
      <SheetTabs />
      
    </div>
  );
}
