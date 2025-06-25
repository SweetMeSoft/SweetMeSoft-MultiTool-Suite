
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  FileSpreadsheet,
  Braces,
  Scissors,
  Code2,
} from 'lucide-react';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/excel-to-sql', label: 'Excel to SQL', icon: FileSpreadsheet },
  { href: '/json-to-excel', label: 'JSON to Excel', icon: Braces },
  { href: '/excel-splitter', label: 'Excel Splitter', icon: Scissors },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-2 w-10 h-10 flex items-center justify-center">
            <Code2 className="text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-lg text-primary">SweetMeSoft</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-muted"
              >
                <Link href={link.href}>
                  <link.icon className="size-4" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SweetMeSoft. All Rights Reserved.</p>
      </SidebarFooter>
    </Sidebar>
  );
}
