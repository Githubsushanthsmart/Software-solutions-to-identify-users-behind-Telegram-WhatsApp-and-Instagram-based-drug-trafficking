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
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertTriangle, Calendar, Search, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export function Dashboard() {
  const suspiciousLogs = useAppStore((state) => state.suspiciousLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const textLogs = useMemo(() => suspiciousLogs.filter(log => log.message), [suspiciousLogs]);
  const imageLogs = useMemo(() => suspiciousLogs.filter(log => log.imageUrl), [suspiciousLogs]);

  const filteredTextLogs = useMemo(() => {
    return textLogs.filter((log) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        log.user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        log.user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        (log.message && log.message.toLowerCase().includes(lowerCaseSearchTerm));

      const matchesDate = dateFilter
        ? format(parseISO(log.timestamp), 'yyyy-MM-dd') === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });
  }, [textLogs, searchTerm, dateFilter]);
  
  const filteredImageLogs = useMemo(() => {
    return imageLogs.filter((log) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        log.user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        log.user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        (log.category && log.category.toLowerCase().includes(lowerCaseSearchTerm));

      const matchesDate = dateFilter
        ? format(parseISO(log.timestamp), 'yyyy-MM-dd') === dateFilter
        : true;

      return matchesSearch && matchesDate;
    });
  }, [imageLogs, searchTerm, dateFilter]);

  const getConfidenceBadgeColor = (score: number) => {
    if (score > 0.9) return 'bg-red-500';
    if (score > 0.8) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <Card className="flex-1">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
                <AlertTriangle className="mr-2 size-4" />
                Text Logs
            </TabsTrigger>
            <TabsTrigger value="images">
                <ImageIcon className="mr-2 size-4" />
                Image Logs
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
                        <TableCell>
                          <div className="font-medium">{log.user.name}</div>
                          <div className="text-sm text-muted-foreground">{log.user.email}</div>
                          <div className="text-sm text-muted-foreground">{log.user.phone}</div>
                        </TableCell>
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
                        <TableCell>
                          <div className="font-medium">{log.user.name}</div>
                          <div className="text-sm text-muted-foreground">{log.user.email}</div>
                          <div className="text-sm text-muted-foreground">{log.user.phone}</div>
                        </TableCell>
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
                              <div className={cn("h-2 rounded-full", getConfidenceBadgeColor(log.confidenceScore))} style={{width: `${log.confidenceScore * 100}%`}}/>
                            </div>
                            <span className="font-mono text-sm font-semibold">{Math.round(log.confidenceScore * 100)}%</span>
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
