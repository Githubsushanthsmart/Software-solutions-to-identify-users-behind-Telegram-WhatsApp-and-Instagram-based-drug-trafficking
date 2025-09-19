'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LiveMap() {
  const suspiciousLogs = useAppStore((state) => state.suspiciousLogs);
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  const mapCenter = suspiciousLogs.length > 0 && suspiciousLogs[0].user.location
    ? [suspiciousLogs[0].user.location.latitude, suspiciousLogs[0].user.location.longitude] as [number, number]
    : defaultCenter;

  return (
    <Card className="flex-1 p-2">
      <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }} className="rounded-md">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {suspiciousLogs.map((log) => {
            if (!log.user.location) return null;
            const position: [number, number] = [log.user.location.latitude, log.user.location.longitude];
            return (
              <Marker key={log.id} position={position} icon={redIcon}>
                <Popup>
                  <div className="space-y-2">
                     <h3 className="font-bold text-base">{log.user.name}</h3>
                     <p className="text-xs text-muted-foreground -mt-2">{log.user.email}</p>
                     <p className="text-sm">
                        <span className="font-semibold">Message:</span> "{log.message}"
                    </p>
                    <div className="text-xs">
                        <p><span className="font-semibold">Confidence:</span> {log.confidenceScore}%</p>
                        <p><span className="font-semibold">Timestamp:</span> {format(parseISO(log.timestamp), 'PPpp')}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
        })}
      </MapContainer>
    </Card>
  );
}