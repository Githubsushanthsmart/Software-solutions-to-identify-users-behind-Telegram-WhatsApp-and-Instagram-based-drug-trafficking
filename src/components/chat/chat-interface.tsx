'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { SendHorizonal, AlertTriangle } from 'lucide-react';
import { drugKeywords } from '@/lib/keywords';
import { createAlertForSuspiciousActivity } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { User, SuspiciousLog } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function ChatInterface() {
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, users, messages, addMessage, addSuspiciousLog } = useAppStore();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const getUserById = (id: string): User | undefined => users.find(u => u.id === id);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleAutoReply = (messageText: string) => {
    const adminUser = users.find(u => u.id === 'admin');
    if (!adminUser) return;

    const lowerCaseMessage = messageText.toLowerCase().trim();
    let replyText: string | null = null;

    if (lowerCaseMessage === 'hi' || lowerCaseMessage === 'hello') {
      replyText = 'Hello!';
    } else if (lowerCaseMessage === 'how are you' || lowerCaseMessage === "how are u") {
      replyText = 'I am fine, thank you! What about you?';
    }

    if (replyText) {
      const replyMessage = {
        id: crypto.randomUUID(),
        text: replyText,
        timestamp: new Date().toISOString(),
        userId: adminUser.id,
        isSuspicious: false,
      };
      
      setTimeout(() => {
        addMessage(replyMessage);
      }, 500);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const messageText = newMessage;
    const isSuspicious = drugKeywords.some(keyword => messageText.toLowerCase().includes(keyword));
    
    const message = {
      id: crypto.randomUUID(),
      text: messageText,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      isSuspicious,
    };

    addMessage(message);
    setNewMessage('');

    if (isSuspicious) {
      const confidenceScore = Math.floor(Math.random() * (99 - 70 + 1)) + 70; // Random score between 70 and 99
      const log: SuspiciousLog = {
        id: message.id,
        user: currentUser,
        message: message.text,
        timestamp: message.timestamp,
        confidenceScore: confidenceScore,
      };
      addSuspiciousLog(log);

      toast({
        variant: "destructive",
        title: "Suspicious Activity Detected",
        description: "An alert has been sent to the administrator.",
      });

      // We don't want to block the UI, so we'll call the AI action without await here
      // and let it show a toast when it's done.
      createAlertForSuspiciousActivity(log).then(({ alertMessage }) => {
        toast({
          title: "AI Alert Summary",
          description: alertMessage,
        });
      });
    } else {
        handleAutoReply(messageText);
    }
  };

  if (!currentUser) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-1 flex-col rounded-lg border bg-card shadow-sm">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg) => {
            const user = getUserById(msg.userId);
            const isCurrentUser = msg.userId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 md:max-w-md',
                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
                     msg.isSuspicious && 'border-2 border-destructive'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                   {msg.isSuspicious && (
                    <div className="mt-2 flex items-center gap-1 pt-1 border-t border-destructive/20">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-xs font-semibold text-destructive">Flagged</span>
                    </div>
                  )}
                </div>
                 {isCurrentUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <div className="relative">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="pr-12"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
