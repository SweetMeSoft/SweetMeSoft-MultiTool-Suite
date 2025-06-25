
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
        title: 'Ningún archivo seleccionado',
        description: 'Por favor, selecciona un archivo de Excel para dividir.',
        variant: 'destructive',
      });
      return;
    }
    if (!rowsPerFile || parseInt(rowsPerFile) <= 0) {
      toast({
        title: 'Número de filas inválido',
        description: 'Por favor, introduce un número positivo de filas por archivo.',
        variant: 'destructive',
      });
      return;
    }

    setIsSplitting(true);
    toast({
      title: 'División en progreso...',
      description: 'Tu archivo ZIP se descargará en breve.',
    });
    setTimeout(() => {
      // In a real app, this would trigger a file download of the ZIP.
      setIsSplitting(false);
      toast({
        title: '¡División completada!',
        description: `El archivo ZIP de prueba de ${file.name} dividido en archivos de ${rowsPerFile} filas está listo para descargar.`,
      });
    }, 2500);
  };

  return (
    <main>
      <PageHeader
        title="Divisor de Excel"
        description="Divide un archivo grande de Excel en archivos más pequeños y descárgalos como un archivo ZIP."
      />
      <Card>
        <CardHeader>
          <CardTitle>Divide tu archivo de Excel</CardTitle>
          <CardDescription>
            Sube tu archivo y especifica el número de filas para cada archivo más pequeño.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>1. Sube tu archivo</Label>
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Haz clic para subir</span> o
                    arrastra y suelta
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
            <Label htmlFor="rows-per-file">2. Filas por archivo</Label>
            <Input
              id="rows-per-file"
              type="number"
              placeholder="p. ej., 10000"
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
            {isSplitting ? 'Dividiendo...' : 'Dividir y descargar ZIP'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
