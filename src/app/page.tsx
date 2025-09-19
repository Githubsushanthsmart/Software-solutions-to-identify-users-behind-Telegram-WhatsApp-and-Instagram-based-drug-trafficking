import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { BrainCircuit, ShieldCheck, Siren, Bot, Map, Mic, UserX, ShieldQuestion, Users } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-20 text-center md:px-6 md:py-32">
          <div className="space-y-6">
            <div className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary">
              Shielding Society from Drug Trafficking with AI
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
              <Link href="/chat">Try Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
               <Link href="/admin">View Dashboard</Link>
            </Button>
          </div>
        </section>
        
        <section id="features" className="container mx-auto py-20 md:py-32">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold tracking-tight">How DrugShield AI Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Our intelligent system uses a multi-layered approach to keep platforms safe.</p>
          </div>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <BrainCircuit className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">NLP &amp; Image Detection</h3>
                    <p className="text-sm text-muted-foreground">Real-time content analysis for text and images.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>Our system employs advanced AI models to perform deep analysis of all content in real time. It understands drug-related slang, code words, and suspicious terminology through Natural Language Processing. Simultaneously, our computer vision algorithms scan images for illicit substances, paraphernalia, and hand signals associated with drug deals.</p>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/chat">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <Siren className="size-10 text-primary" />
                   <div className="text-left">
                    <h3 className="text-lg font-semibold">Real-Time Alert System</h3>
                    <p className="text-sm text-muted-foreground">Instant notifications for rapid response.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>When a potential threat is identified, DrugShield AI instantaneously generates an alert for platform administrators. These alerts are prioritized by a confidence score, allowing moderators to address the most critical issues first. The system provides a detailed report, including the flagged content and user information, to enable swift and decisive action.</p>
                 <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/admin">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <ShieldCheck className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Secure &amp; Private</h3>
                    <p className="text-sm text-muted-foreground">Encrypted data storage with user privacy in mind.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>All flagged content and associated metadata are securely logged in an encrypted database. We prioritize user privacy by focusing only on publicly available data within the platform and ensuring that access to the alert logs is restricted to authorized administrators. Our goal is to maintain platform integrity without compromising user confidentiality.</p>
                 <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/admin">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <Bot className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">AI Model Adaptability</h3>
                    <p className="text-sm text-muted-foreground">Continuously learning and evolving detection.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>The digital landscape and illicit terminologies are constantly changing. Our AI models are designed to be adaptable, allowing for easy updates to the keyword lists and detection logic. This ensures that DrugShield AI stays ahead of new slang and evolving tactics used by malicious actors.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <Map className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Mapping &amp; Network Analysis</h3>
                    <p className="text-sm text-muted-foreground">Visualize threats and user connections.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>Our platform includes a static threat map to visualize the geographic locations of monitored activities. Future versions will incorporate dynamic network analysis to map connections between high-risk users, helping administrators identify organized trafficking networks and understand their structure.</p>
                 <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/admin/map">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <Mic className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Voice &amp; Audio Analysis</h3>
                    <p className="text-sm text-muted-foreground">Detecting threats in voice communications.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>DrugShield AI goes beyond text and images by analyzing audio messages. It transcribes voice notes into text and scans the transcription for suspicious keywords and phrases. This capability ensures that even spoken conversations are monitored, closing a common loophole for illicit communication.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <Users className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Dashboard Highlights</h3>
                    <p className="text-sm text-muted-foreground">Identify top offenders at a glance.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>The admin dashboard prominently features the "Top 5 High-Risk Users," allowing moderators to quickly focus on the most problematic accounts. This is determined by the frequency and severity of suspicious activity flags, enabling efficient and targeted enforcement actions.</p>
                 <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/admin">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-8">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <ShieldQuestion className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Fake Profile Detection</h3>
                    <p className="text-sm text-muted-foreground">Identify fraudulent accounts with AI.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>Our system uses AI to analyze profile pictures for signs of a fake identity. The model can determine if an image is a stock photo, a picture of a celebrity, or a widely used internet image, helping to uncover bots and fraudulent accounts used for illicit activities.</p>
                 <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/admin/fake-profiles">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-9">
              <AccordionTrigger>
                <CardHeader className="flex-row items-center gap-4 p-0">
                  <UserX className="size-10 text-primary" />
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">Emergency Ban &amp; Unban</h3>
                    <p className="text-sm text-muted-foreground">Instantly suspend and reinstate users.</p>
                  </div>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-16">
                <p>Administrators have the power to take immediate action. The "Emergency Lock Mode" allows an admin to instantly ban or unban a user directly from the dashboard. A banned user is immediately blocked from the chat and sees an account suspension notice, providing a real-time enforcement mechanism.</p>
                 <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link href="/admin">Learn More</Link>
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

      </main>
      <footer className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DrugShield AI. Hackathon Project.
      </footer>
    </div>
  );
}
