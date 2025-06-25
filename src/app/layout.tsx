import type { Metadata } from 'next';
import './globals.css';
import { AppHeader } from '@/components/shared/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/shared/app-footer';

export const metadata: Metadata = {
  title: 'SweetMeSoft MultiTool Suite',
  description: 'A suite of powerful and easy-to-use tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen font-body antialiased">
        <AppHeader />
        <main className="container flex-1 py-8">{children}</main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
