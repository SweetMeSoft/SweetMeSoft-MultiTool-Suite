'use client';

import { useState } from 'react';
import * as xlsx from 'xlsx';
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
  const [tableName, setTableName] = useState('nombre_de_la_tabla');
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
    if (!tableName.trim()) {
      toast({
        title: 'Nombre de tabla inválido',
        description: 'Por favor, introduce un nombre para la tabla.',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json<any>(worksheet);

        if (json.length === 0) {
          toast({
            title: 'Archivo vacío',
            description: 'El archivo de Excel no contiene datos.',
            variant: 'destructive',
          });
          setIsConverting(false);
          return;
        }

        const headers = Object.keys(json[0]);
        const escapedTableName = `\`${tableName.trim()}\``;
        const escapedHeaders = headers.map((h) => `\`${h}\``).join(', ');

        const values = json
          .map((row) => {
            const rowValues = headers
              .map((header) => {
                const value = row[header];
                if (value === null || value === undefined) {
                  return 'NULL';
                }
                // Escape single quotes by doubling them
                return `'${String(value).replace(/'/g, "''")}'`;
              })
              .join(', ');
            return `(${rowValues})`;
          })
          .join(',\n');

        const sql = `INSERT INTO ${escapedTableName} (${escapedHeaders}) VALUES\n${values};`;
        setSqlOutput(sql);
      } catch (error) {
        console.error('Error al convertir el archivo:', error);
        toast({
          title: 'Error de conversión',
          description:
            'No se pudo procesar el archivo. Asegúrate de que sea un archivo de Excel válido.',
          variant: 'destructive',
        });
      } finally {
        setIsConverting(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: 'Error de lectura',
        description: 'No se pudo leer el archivo.',
        variant: 'destructive',
      });
      setIsConverting(false);
    };

    reader.readAsBinaryString(file);
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
            <CardTitle>Configuración</CardTitle>
            <CardDescription>
              Completa los siguientes pasos para generar tu script SQL.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="table-name">2. Nombre de la tabla</Label>
              <Input
                id="table-name"
                type="text"
                placeholder="p. ej., clientes"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>

            <Button
              onClick={handleConvert}
              disabled={!file || !tableName.trim() || isConverting}
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
                <CardTitle>3. Salida SQL</CardTitle>
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
