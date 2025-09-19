'use client';

import { LiveMap } from '@/components/admin/live-map';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/admin/live-map').then(mod => mod.LiveMap), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function MapPage() {
  return (
    <div className="flex h-full flex-col gap-6">
       <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Live Activity Map</h1>
        <p className="text-muted-foreground">
          Real-time locations of suspicious activity detections.
        </p>
      </div>
      <DynamicMap />
    </div>
  );
}
