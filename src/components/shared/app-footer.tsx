'use client';

import Link from 'next/link';
import { Heart, Linkedin } from 'lucide-react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );

export function AppFooter() {
  return (
    <footer className="w-full py-6 mt-auto border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 text-center md:flex-row">
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Herramienta gratuita creada por{' '}
            <Link href="https://sweetmesoft.com/" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4 hover:text-primary">
              SweetMeSoft
            </Link>
            .
          </p>
          <p>
            Solicita cambios o mejoras a través de{' '}
            <Link href="https://github.com/SweetMeSoft/SweetMeSoft-MultiTool-Suite/issues" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4 hover:text-primary">
              GitHub Issues
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-4">
            <Link href="https://www.linkedin.com/company/sweetmesoft/about/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5 transition-colors text-muted-foreground hover:text-primary" />
            </Link>
            <Link href="https://www.instagram.com/sweetmesoftco/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="w-5 h-5 transition-colors text-muted-foreground hover:text-primary" />
            </Link>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Cada detalle nos importa
            <Heart className="w-4 h-4 text-blue-500 fill-blue-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
