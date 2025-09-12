'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, ShieldAlert, FileText, Info } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/chat', label: 'Chat Simulator', icon: MessageSquare },
  { href: '/admin', label: 'Admin Dashboard', icon: ShieldAlert },
  { href: '/about', label: 'About', icon: Info },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
