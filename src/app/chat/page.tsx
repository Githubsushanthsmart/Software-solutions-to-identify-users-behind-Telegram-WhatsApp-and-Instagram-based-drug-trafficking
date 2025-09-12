import { ChatInterface } from '@/components/chat/chat-interface';

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
       <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Chat Simulator</h1>
        <p className="text-muted-foreground">
          This is a demonstration environment. Messages are monitored for suspicious activity.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
