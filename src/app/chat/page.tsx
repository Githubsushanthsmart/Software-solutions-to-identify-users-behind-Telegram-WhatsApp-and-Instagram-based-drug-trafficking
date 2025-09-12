import { ChatInterface } from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
       <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Chat Simulator</h1>
        <p className="text-muted-foreground">
          This is a demonstration environment. Messages are monitored for suspicious activity.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
