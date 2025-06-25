
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
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/shared/page-header';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function JsonToExcelPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConvert = () => {
    try {
      JSON.parse(jsonInput);
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Please enter valid JSON data.',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: 'Conversion in progress...',
      description: 'Your Excel file will be downloaded shortly.',
    });
    setTimeout(() => {
      // In a real app, this would trigger a file download generated from the JSON.
      // For this mock, we just show a success message.
      setIsConverting(false);
      toast({
        title: 'Conversion Complete!',
        description: 'Mock file download initiated.',
      });
    }, 2000);
  };

  return (
    <main>
      <PageHeader
        title="JSON to Excel Converter"
        description="Paste your JSON data to convert it into an Excel spreadsheet."
      />

      <Card>
        <CardHeader>
          <CardTitle>1. Paste JSON Data</CardTitle>
          <CardDescription>
            Enter the JSON array of objects you wish to convert.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder='[{"id": 1, "name": "Item A"}, {"id": 2, "name": "Item B"}]'
            className="min-h-[300px] font-mono"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <Button
            onClick={handleConvert}
            disabled={!jsonInput || isConverting}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Download className="mr-2 h-4 w-4" />
            {isConverting ? 'Converting...' : 'Convert & Download Excel'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
