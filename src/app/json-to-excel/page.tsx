
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
        title: 'JSON inválido',
        description: 'Por favor, introduce datos JSON válidos.',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: 'Conversión en progreso...',
      description: 'Tu archivo Excel se descargará en breve.',
    });
    setTimeout(() => {
      // In a real app, this would trigger a file download generated from the JSON.
      // For this mock, we just show a success message.
      setIsConverting(false);
      toast({
        title: '¡Conversión completada!',
        description: 'Descarga de archivo de prueba iniciada.',
      });
    }, 2000);
  };

  return (
    <main>
      <PageHeader
        title="Convertidor de JSON a Excel"
        description="Pega tus datos JSON para convertirlos en una hoja de cálculo de Excel."
      />

      <Card>
        <CardHeader>
          <CardTitle>1. Pega los datos JSON</CardTitle>
          <CardDescription>
            Introduce el array de objetos JSON que deseas convertir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder='[{"id": 1, "nombre": "Artículo A"}, {"id": 2, "nombre": "Artículo B"}]'
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
            {isConverting ? 'Convirtiendo...' : 'Convertir y descargar Excel'}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
