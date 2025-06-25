import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileSpreadsheet, Braces, Scissors } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const tools: Tool[] = [
  {
    title: 'Convertidor de Excel a SQL',
    description:
      'Convierte sin esfuerzo tus archivos de Excel en sentencias INSERT de SQL.',
    href: '/excel-to-sql',
    icon: FileSpreadsheet,
  },
  {
    title: 'Convertidor de JSON a Excel',
    description: 'Transforma datos JSON en hojas de cálculo de Excel bien estructuradas.',
    href: '/json-to-excel',
    icon: Braces,
  },
  {
    title: 'Divisor de Excel',
    description:
      'Divide archivos grandes de Excel en partes más pequeñas y comprímelas.',
    href: '/excel-splitter',
    icon: Scissors,
  },
];

const ToolCard = ({ tool }: { tool: Tool }) => (
  <Link href={tool.href} className="group block h-full">
    <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-border hover:border-primary">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{tool.title}</CardTitle>
          <div className="bg-muted p-3 rounded-md">
            <tool.icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{tool.description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default function Home() {
  return (
    <main>
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Panel de la Suite de Herramientas
        </h1>
        <p className="text-lg text-muted-foreground">
          ¡Bienvenido! Selecciona una herramienta para comenzar.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.href} tool={tool} />
        ))}
      </div>
    </main>
  );
}
