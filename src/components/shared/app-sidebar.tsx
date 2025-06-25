
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileSpreadsheet,
  Braces,
  Scissors,
  Code2,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useState } from 'react';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/excel-to-sql', label: 'Excel to SQL', icon: FileSpreadsheet },
  { href: '/json-to-excel', label: 'JSON to Excel', icon: Braces },
  { href: '/excel-splitter', label: 'Excel Splitter', icon: Scissors },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">SweetMeSoft</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-foreground/80 ${
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-4">
                <Link
                  href="/"
                  className="mb-8 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Code2 className="h-6 w-6 text-primary" />
                  <span className="font-bold text-primary">SweetMeSoft</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {links.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={`-mx-3 flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground ${
                          pathname === link.href ? 'bg-muted text-foreground' : ''
                        }`}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
