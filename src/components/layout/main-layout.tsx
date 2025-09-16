'use client';

import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { SidebarNav } from './sidebar-nav';
import { Logo } from '../icons/logo';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { UserForm } from '../auth/user-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const currentUser = useAppStore((state) => state.currentUser);
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const clearChat = useAppStore((state) => state.clearChat);
  const router = useRouter();

  const handleLogout = () => {
    setCurrentUser(null);
    clearChat();
    router.push('/');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-lg font-semibold">DrugShield AI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        {currentUser && (
          <SidebarFooter>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{currentUser.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{currentUser.name}</span>
                <span className="text-xs text-muted-foreground">{currentUser.email}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start gap-2">
              <LogOut className="size-4" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        )}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-xl">
                    {/* Could be dynamic based on page */}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {!currentUser ? (
            <Dialog open={!currentUser}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join the Chat Simulator</DialogTitle>
                        <DialogDescription>
                            Enter your details to begin the demonstration.
                        </DialogDescription>
                    </DialogHeader>
                    <UserForm />
                </DialogContent>
            </Dialog>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
