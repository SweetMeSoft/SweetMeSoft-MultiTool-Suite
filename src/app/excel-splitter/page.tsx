
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/shared/page-header';
import { UploadCloud, File, X, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExcelSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rowsPerFile, setRowsPerFile] = useState('10000');
  const [isSplitting, setIsSplitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSplit = () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an Excel file to split.',
        variant: 'destructive',
      });
      return;
    }
    if (!rowsPerFile || parseInt(rowsPerFile) <= 0) {
      toast({
        title: 'Invalid row count',
        description: 'Please enter a positive number of rows per file.',
        variant: 'destructive',
      });
      return;
    }

    setIsSplitting(true);
    toast({
      title: 'Splitting in progress...',
      description: 'Your ZIP archive will be downloaded shortly.',
    });
    setTimeout(() => {
      // In a real app, this would trigger a file download of the ZIP.
      setIsSplitting(false);
      toast({
        title: 'Splitting Complete!',
        description: `Mock ZIP archive of ${file.name} split into files of ${rowsPerFile} rows is ready for download.`,
      });
    }, 2500);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Excel Splitter"
        description="Split a large Excel file into smaller files and download as a ZIP archive."
      />
      <Card>
        <CardHeader>
          <CardTitle>Split Your Excel File</CardTitle>
          <CardDescription>
            Upload your file and specify the number of rows for each smaller
            file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>1. Upload File</Label>
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">XLSX, XLS</p>
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                />
              </Label>
            </div>
            {file && (
              <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                <div className="flex items-center gap-2 overflow-hidden">
                  <File className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {file.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => setFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rows-per-file">2. Rows Per File</Label>
            <Input
              id="rows-per-file"
              type="number"
              placeholder="e.g., 10000"
              value={rowsPerFile}
              onChange={(e) => setRowsPerFile(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <Button
            onClick={handleSplit}
            disabled={!file || isSplitting}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Archive className="mr-2 h-4 w-4" />
            {isSplitting ? 'Splitting...' : 'Split & Download ZIP'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
