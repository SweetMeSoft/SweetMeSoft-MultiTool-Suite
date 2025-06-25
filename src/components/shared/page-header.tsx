
interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}
