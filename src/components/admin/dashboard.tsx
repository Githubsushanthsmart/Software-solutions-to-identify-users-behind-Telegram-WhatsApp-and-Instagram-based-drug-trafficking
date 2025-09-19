'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertTriangle, Calendar, Search, Image as ImageIcon, Mic, User as UserIcon, ShieldBan, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const { suspiciousLogs, banUser, unbanUser, users } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const { toast } = useToast();

  const textLogs = useMemo(() => suspiciousLogs.filter(log => log.message), [suspiciousLogs]);
  const imageLogs = useMemo(() => suspiciousLogs.filter(log => log.imageUrl), [suspiciousLogs]);
  const audioLogs = useMemo(() => suspiciousLogs.filter(log => log.audioUrl), [suspiciousLogs]);

  const topHighRiskUsers = useMemo(() => {
    const userIncidents: { [key: string]: { user: User; count: number } } = {};

    suspiciousLogs.forEach(log => {
      if(log.user.id === 'admin') return;

      if (userIncidents[log.user.id]) {
        userIncidents[log.user.id].count++;
      } else {
        userIncidents[log.user.id] = { user: log.user, count: 1 };
      }
    });

    return Object.values(userIncidents)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [suspiciousLogs]);
  
  const handleToggleBanUser = (user: User) => {
    if (user.id === 'admin') {
      toast({ variant: 'destructive', title: 'Error', description: 'Cannot ban an admin user.' });
      return;
    }
    
    if (user.status === 'banned') {
      unbanUser(user.id);
      toast({
        title: 'User Unbanned',
        description: `${user.name} has been reinstated and can send messages again.`,
      });
    } else {
      banUser(user.id);
      toast({
        title: 'User Banned',
        description: `${user.name} has been suspended and can no longer send messages.`,
      });
    }
  }

  const filterLogs = (logs: any[], keys: string[]) => {
     return logs.filter((log) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      
      const matchesSearch = keys.some(key => {
        const value = log[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerCaseSearchTerm);
        }
        return false;
      }) || log.user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
             log.user.email.toLowerCase().includes(lowerCaseSearchTerm);

      const matchesDate = dateFilter
        ? format(parseISO(log.timestamp), 'yyyy-MM-dd') === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });
  }

  const filteredTextLogs = useMemo(() => filterLogs(textLogs, ['message']), [textLogs, searchTerm, dateFilter]);
  const filteredImageLogs = useMemo(() => filterLogs(imageLogs, ['category']), [imageLogs, searchTerm, dateFilter]);
  const filteredAudioLogs = useMemo(() => filterLogs(audioLogs, ['transcription']), [audioLogs, searchTerm, dateFilter]);

  const getConfidenceBadgeColor = (score: number) => {
    if (score > 0.9) return 'bg-red-500';
    if (score > 0.8) return 'bg-orange-500';
    return 'bg-yellow-500';
  };
  
  const getConfidencePercentage = (score: number) => {
    // text log scores are 0-100, image/audio are 0-1
    return score > 1 ? score : Math.round(score * 100);
  }
  
  const UserInfoCell = ({ user }: { user: User }) => {
    const fullUser = users.find(u => u.id === user.id) || user;
    
    return (
       <TableCell>
        <div className="font-medium">{fullUser.name}</div>
        <div className="text-sm text-muted-foreground">{fullUser.email}</div>
        <div className="text-sm text-muted-foreground">{fullUser.phone}</div>
        <div className="mt-2 flex gap-2 items-center">
            {fullUser.status === 'banned' ? (
                <Badge variant="destructive" className="gap-1"> <ShieldBan className="size-3" /> Banned</Badge>
            ) : (
                <Badge variant="secondary">Active</Badge>
            )}
            <Button 
                variant={fullUser.status === 'banned' ? 'secondary' : 'destructive'}
                size="sm" 
                className="h-7"
                onClick={() => handleToggleBanUser(fullUser)}
                disabled={fullUser.id === 'admin'}
            >
                {fullUser.status === 'banned' ? <ShieldCheck className="mr-1 size-3"/> : <ShieldBan className="mr-1 size-3"/>}
                {fullUser.status === 'banned' ? 'Unban' : 'Ban'}
            </Button>
        </div>
      </TableCell>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="text-primary" />
            Top 5 High-Risk Users
          </CardTitle>
          <CardDescription>
            Users with the highest number of suspicious activity flags.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topHighRiskUsers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {topHighRiskUsers.map(({ user, count }) => (
                <div key={user.id} className="flex items-center gap-4 rounded-lg bg-muted p-3">
                  <Avatar>
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">Incidents</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No high-risk users identified yet.
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                  <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-primary" />
                      Suspicious Activity
                  </CardTitle>
                  <CardDescription>
                      {suspiciousLogs.length} total incidents flagged.
                  </CardDescription>
              </div>
            <div className="flex gap-2">
              <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Filter by user or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 md:w-64"
                  />
              </div>
              <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full pl-8 md:w-auto"
                  />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">
                  <AlertTriangle className="mr-2 size-4" />
                  Text Logs
              </TabsTrigger>
              <TabsTrigger value="images">
                  <ImageIcon className="mr-2 size-4" />
                  Image Logs
              </TabsTrigger>
              <TabsTrigger value="audio">
                  <Mic className="mr-2 size-4" />
                  Audio Logs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Suspicious Message</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTextLogs.length > 0 ? (
                      filteredTextLogs.map((log) => (
                        <TableRow key={log.id}>
                          <UserInfoCell user={log.user} />
                          <TableCell>
                              <p className="max-w-sm truncate">{log.message}</p>
                          </TableCell>
                          <TableCell>{format(parseISO(log.timestamp), 'MMM d, yyyy, h:mm a')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full">
                                <div className={cn("h-2 rounded-full", getConfidenceBadgeColor(log.confidenceScore / 100))} style={{width: `${log.confidenceScore}%`}}/>
                              </div>
                              <span className="font-mono text-sm font-semibold">{log.confidenceScore}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No suspicious text logs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="images" className="mt-4">
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Image Preview</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredImageLogs.length > 0 ? (
                      filteredImageLogs.map((log) => (
                        <TableRow key={log.id}>
                          <UserInfoCell user={log.user} />
                          <TableCell>
                            {log.imageUrl && (
                              <Image src={log.imageUrl} alt="Suspicious Content" width={100} height={100} className="rounded-md object-cover" />
                            )}
                          </TableCell>
                          <TableCell>{log.category}</TableCell>
                          <TableCell>{format(parseISO(log.timestamp), 'MMM d, yyyy, h:mm a')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full">
                                <div className={cn("h-2 rounded-full", getConfidenceBadgeColor(log.confidenceScore))} style={{width: `${getConfidencePercentage(log.confidenceScore)}%`}}/>
                              </div>
                              <span className="font-mono text-sm font-semibold">{getConfidencePercentage(log.confidenceScore)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No suspicious image logs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="audio" className="mt-4">
              <div className="overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Audio</TableHead>
                      <TableHead>Transcription</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudioLogs.length > 0 ? (
                      filteredAudioLogs.map((log) => (
                        <TableRow key={log.id}>
                           <UserInfoCell user={log.user} />
                          <TableCell>
                            {log.audioUrl && (
                              <audio controls src={log.audioUrl} className="w-64" />
                            )}
                          </TableCell>
                          <TableCell>
                              <p className="max-w-xs truncate italic">"{log.transcription}"</p>
                          </TableCell>
                          <TableCell>{format(parseISO(log.timestamp), 'MMM d, yyyy, h:mm a')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full">
                                <div className={cn("h-2 rounded-full", getConfidenceBadgeColor(log.confidenceScore))} style={{width: `${getConfidencePercentage(log.confidenceScore)}%`}}/>
                              </div>
                              <span className="font-mono text-sm font-semibold">{getConfidencePercentage(log.confidenceScore)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No suspicious audio logs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
