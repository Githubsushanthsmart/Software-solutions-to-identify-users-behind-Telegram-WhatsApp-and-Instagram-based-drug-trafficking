import { UserForm } from '@/components/auth/user-form';
import { Logo } from '@/components/icons/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">ChatSecure AI</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-12 text-center md:px-6 md:py-24">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Detect and Monitor Illicit Activity
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              ChatSecure AI is an advanced solution for detecting drug-related conversations on chat platforms, helping to create a safer digital environment.
            </p>
          </div>
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Join the Chat Simulator</CardTitle>
              <CardDescription>Enter your details to begin the demonstration.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm />
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="container mx-auto py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ChatSecure AI. All rights reserved.
      </footer>
    </div>
  );
}
