'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
});

// Mock locations for demo purposes
const mockLocations = [
  { name: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
];

export function UserForm() {
  const router = useRouter();
  const { setCurrentUser, addUser } = useAppStore();
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Test User',
      email: 'test.user@example.com',
      phone: '555-123-4567',
    },
  });

  const getLocation = (): Promise<{ latitude: number; longitude: number; }> => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            // User denied permission, use a mock location
            toast({
              title: "Location Access Denied",
              description: "Using a mock location for the demo.",
            });
            resolve(mockLocations[Math.floor(Math.random() * mockLocations.length)]);
          }
        );
      } else {
        // Geolocation not supported
        toast({
          title: "Geolocation Not Supported",
          description: "Using a mock location for the demo.",
        });
        resolve(mockLocations[Math.floor(Math.random() * mockLocations.length)]);
      }
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLocating(true);
    toast({
      title: 'Getting your location...',
      description: 'Please wait while we fetch your location for the demo.',
    });
    
    const location = await getLocation();

    setIsLocating(false);

    const newUser = {
      id: crypto.randomUUID(),
      ...values,
      status: 'active' as const,
      location,
    };
    
    addUser(newUser);
    setCurrentUser(newUser);
    router.push('/chat');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="555-123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLocating}>
          {isLocating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Locating...
            </>
          ) : (
            'Enter Simulator'
          )}
        </Button>
      </form>
    </Form>
  );
}
