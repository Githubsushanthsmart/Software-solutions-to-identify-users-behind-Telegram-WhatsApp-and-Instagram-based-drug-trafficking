import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">About DrugShield AI</h1>
        <p className="text-lg text-muted-foreground">
          Shielding Society from Drug Trafficking with AI.
        </p>
      </div>

      <div className="space-y-12">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>The Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Online platforms and social media have become new vectors for illicit drug trafficking. Anonymity and the sheer volume of communication make it incredibly difficult for human moderators to detect and prevent these illegal activities. This exposes vulnerable individuals, particularly young people, to significant harm and fuels a wider criminal network.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Our Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              DrugShield AI is an intelligent monitoring system designed to proactively identify and flag drug-related conversations on digital platforms. By leveraging cutting-edge Natural Language Processing (NLP) and computer vision, our system can understand slang, interpret suspicious imagery, and recognize patterns associated with illegal transactions. It provides administrators with real-time alerts and a comprehensive dashboard to take swift, informed action, creating a safer digital environment for everyone.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Future Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Multi-Language Support:</strong> Expanding our AI models to understand and process various languages to provide global protection.</li>
              <li><strong>Decentralized Logging:</strong> Utilizing blockchain technology to create a tamper-proof, immutable log of all suspicious activities for enhanced security and transparency.</li>
              <li><strong>Platform API Monitoring:</strong> Developing an API that allows other platforms to integrate DrugShield AI's detection capabilities directly into their services.</li>
              <li><strong>User Network Analysis:</strong> Building advanced graph visualizations to map connections between flagged users and identify organized trafficking networks.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This project was developed for a hackathon by a team of passionate developers and AI enthusiasts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
