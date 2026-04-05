
'use client';

import {
  Card,
  CardContent,
  CardDescription,
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
import { Button } from '@/components/ui/button';
import { Download, FileType, Calendar, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import sampleReports from '@/lib/data/sample-reports.json';

const records = [
  {
    id: 1,
    name: 'Annual Physical Exam',
    date: '2023-10-15',
    type: 'Report',
    doctor: 'Dr. Priya Sharma',
  },
  {
    id: 2,
    name: 'Blood Test Results',
    date: '2023-10-20',
    type: 'Lab Result',
    doctor: 'Dr. Priya Sharma',
  },
  {
    id: 3,
    name: 'Cardiology Consultation',
    date: '2023-11-05',
    type: 'Consultation Note',
    doctor: 'Dr. Priya Sharma',
  },
  {
    id: 4,
    name: 'Amoxicillin Prescription',
    date: '2024-01-22',
    type: 'Prescription',
    doctor: 'Dr. Rohan Mehra',
  },
  {
    id: 5,
    name: 'Follow-up Visit',
    date: '2024-02-10',
    type: 'Consultation Note',
    doctor: 'Dr. Rohan Mehra',
  },
];

const getTypeBadge = (type: string) => {
  switch (type) {
    case 'Report':
      return 'default';
    case 'Lab Result':
      return 'secondary';
    case 'Prescription':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function HealthRecordsPage() {
    const handleDownload = (recordId: number, recordName: string) => {
        const report = sampleReports.find(r => r.id === recordId);
        if (report) {
            const blob = new Blob([report.content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${recordName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Health Records</CardTitle>
        <CardDescription>
          Access your past consultations, reports, and prescriptions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Offline Access Enabled</AlertTitle>
            <AlertDescription>
                Your health records are securely stored on your device for access even without an internet connection. (This is a simulated feature).
            </AlertDescription>
        </Alert>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record Name</TableHead>
              <TableHead className="hidden md:table-cell">
                <FileType className="inline-block mr-2 h-4 w-4" /> Type
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <Calendar className="inline-block mr-2 h-4 w-4" /> Date
              </TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={getTypeBadge(record.type) as any}>
                    {record.type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{record.date}</TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(record.id, record.name)}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
