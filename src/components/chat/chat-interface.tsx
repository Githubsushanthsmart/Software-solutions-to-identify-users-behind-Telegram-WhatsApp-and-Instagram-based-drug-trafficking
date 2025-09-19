'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { SendHorizonal, AlertTriangle, Paperclip, X, Loader2 } from 'lucide-react';
import { drugKeywords } from '@/lib/keywords';
import { createAlertForSuspiciousActivity } from '@/app/actions';
import { analyzeImage } from '@/ai/flows/analyze-image-flow';
import { useToast } from '@/hooks/use-toast';
import { User, SuspiciousLog, Message } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function ChatInterface() {
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { currentUser, users, messages, addMessage, addSuspiciousLog } = useAppStore();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      const replyMessage: Message = {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !imageFile) || !currentUser) return;
    
    if (imageFile && imagePreview) {
      await handleSendImageMessage(imagePreview);
    }

    if (newMessage.trim()) {
      await handleSendTextMessage(newMessage);
    }

    setNewMessage('');
    clearImagePreview();
  };

  const handleSendTextMessage = async (text: string) => {
    if (!currentUser) return;

    const isSuspicious = drugKeywords.some(keyword => text.toLowerCase().includes(keyword));
    
    const message: Message = {
      id: crypto.randomUUID(),
      text: text,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      isSuspicious,
    };

    addMessage(message);

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

      createAlertForSuspiciousActivity(log).then(({ alertMessage }) => {
        toast({
          title: "AI Alert Summary",
          description: alertMessage,
        });
      });
    } else {
        handleAutoReply(text);
    }
  };
  
  const handleSendImageMessage = async (imageDataUri: string) => {
    if (!currentUser) return;
    setIsAnalyzing(true);
    
    const analysis = await analyzeImage({ photoDataUri: imageDataUri });

    const message: Message = {
      id: crypto.randomUUID(),
      imageUrl: imageDataUri,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      isSuspicious: analysis.isSuspicious,
      suspicionCategory: analysis.category
    };

    addMessage(message);
    setIsAnalyzing(false);

    if (analysis.isSuspicious) {
      const log: SuspiciousLog = {
        id: message.id,
        user: currentUser,
        imageUrl: imageDataUri,
        timestamp: message.timestamp,
        confidenceScore: analysis.confidenceScore,
        category: analysis.category,
      };
      addSuspiciousLog(log);

      toast({
        variant: "destructive",
        title: "Suspicious Image Detected",
        description: `Category: ${analysis.category}. An alert has been sent to the administrator.`,
      });
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
                  <Avatar className="h-8 w-8 self-end">
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-2 md:max-w-md',
                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
                     msg.isSuspicious && 'border-2 border-destructive'
                  )}
                >
                  {msg.imageUrl ? (
                    <Image src={msg.imageUrl} alt="Chat image" width={250} height={250} className="rounded-md object-cover" />
                  ) : (
                    <p className="text-sm p-1">{msg.text}</p>
                  )}
                   {(msg.isSuspicious) && (
                    <div className="mt-2 flex items-center gap-1 pt-1 border-t border-destructive/20 px-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span className="text-xs font-semibold text-destructive">
                        Flagged{msg.suspicionCategory && `: ${msg.suspicionCategory}`}
                      </span>
                    </div>
                  )}
                </div>
                 {isCurrentUser && (
                  <Avatar className="h-8 w-8 self-end">
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          {isAnalyzing && (
             <div className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
                <p className="text-sm text-muted-foreground">Analyzing image...</p>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        {imagePreview && (
          <div className="relative mb-2 w-28 h-28">
            <Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover" />
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={clearImagePreview}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="relative">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            className="pr-24"
            disabled={isAnalyzing}
          />
          <div className="absolute right-1 top-1/2 flex h-8 -translate-y-1/2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach image</span>
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button
              type="submit"
              size="icon"
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && !imageFile) || isAnalyzing}
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin"/> : <SendHorizonal className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
