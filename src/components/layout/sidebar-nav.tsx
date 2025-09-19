'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, ShieldAlert, FileText, Info, Map, ShieldQuestion } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/chat', label: 'Chat Simulator', icon: MessageSquare },
  { href: '/admin', label: 'Admin Dashboard', icon: ShieldAlert },
  { href: '/admin/map', label: 'Static Map', icon: Map },
  { href: '/admin/fake-profiles', label: 'Fake Profiles', icon: ShieldQuestion },
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
              isActive={pathname === item.href}
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
