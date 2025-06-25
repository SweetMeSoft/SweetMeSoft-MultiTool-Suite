
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
        title: 'Ningún archivo seleccionado',
        description: 'Por favor, selecciona un archivo de Excel para convertir.',
        variant: 'destructive',
      });
      return;
    }
    setIsConverting(true);
    // Mock conversion
    setTimeout(() => {
      const mockSql = `INSERT INTO nombre_de_tu_tabla (columna1, columna2, columna3) VALUES\n('dato1', 'dato2', 'dato3'),\n('dato4', 'dato5', 'dato6'),\n('dato7', 'dato8', 'dato9');\n-- Estos son datos de prueba basados en '${file.name}'. La detección automática de columnas es simulada.`;
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
      title: '¡Copiado al portapapeles!',
      description: 'La salida SQL ha sido copiada.',
    });
  };

  return (
    <main>
      <PageHeader
        title="Convertidor de Excel a SQL"
        description="Sube un archivo de Excel para generar automáticamente sentencias INSERT de SQL."
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Sube tu archivo</CardTitle>
            <CardDescription>
              Selecciona el archivo .xlsx o .xls que deseas convertir.
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
                    <span className="font-semibold">Haz clic para subir</span> o
                    arrastra y suelta
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
              {isConverting ? 'Convirtiendo...' : 'Convertir a SQL'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>2. Salida SQL</CardTitle>
                <CardDescription>
                  Tu código SQL generado aparecerá aquí.
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
                {sqlOutput || 'Esperando la conversión del archivo...'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
