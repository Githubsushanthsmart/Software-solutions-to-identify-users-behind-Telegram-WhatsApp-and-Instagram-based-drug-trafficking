import { UserForm } from '@/components/auth/user-form';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">DrugShield AI</h1>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">Demo</Link>
          <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-20 text-center md:px-6 md:py-32">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary">
              Shielding Society from Drug Trafficking
            </div>
            <h2 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Detect. Flag. Protect.
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              An AI-powered solution for detecting and monitoring illicit drug-related activities on chat platforms to create a safer digital environment.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/chat">Live Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
               <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DrugShield AI. Hackathon Project.
      </footer>
    </div>
  );
}
