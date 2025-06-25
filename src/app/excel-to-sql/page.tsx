
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
import { UploadCloud, File, X, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExcelToSqlPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sqlOutput, setSqlOutput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setSqlOutput('');
    }
  };

  const handleConvert = () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select an Excel file to convert.',
        variant: 'destructive',
      });
      return;
    }
    setIsConverting(true);
    // Mock conversion
    setTimeout(() => {
      const mockSql = `INSERT INTO your_table_name (column1, column2, column3) VALUES\n('data1', 'data2', 'data3'),\n('data4', 'data5', 'data6'),\n('data7', 'data8', 'data9');\n-- This is mock data based on '${file.name}'. Automatic column detection is simulated.`;
      setSqlOutput(mockSql);
      setIsConverting(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (!sqlOutput) return;
    navigator.clipboard.writeText(sqlOutput);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: 'Copied to clipboard!',
      description: 'The SQL output has been copied.',
    });
  };

  return (
    <main className="flex-1 p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Excel to SQL Converter"
        description="Upload an Excel file to automatically generate SQL INSERT statements."
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Upload File</CardTitle>
            <CardDescription>
              Select the .xlsx or .xls file you want to convert.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    XLSX, XLS (MAX. 5MB)
                  </p>
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
                  onClick={() => {
                    setFile(null);
                    setSqlOutput('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
            <Button
              onClick={handleConvert}
              disabled={!file || isConverting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isConverting ? 'Converting...' : 'Convert to SQL'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>2. SQL Output</CardTitle>
                <CardDescription>
                  Your generated SQL code will appear here.
                </CardDescription>
              </div>
              {sqlOutput && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 w-full bg-muted rounded-md overflow-auto">
              <pre className="p-4 text-sm font-mono text-foreground whitespace-pre-wrap">
                {sqlOutput || 'Awaiting file conversion...'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
