'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const locations = [
  { name: 'Delhi', position: [28.7041, 77.1025] as [number, number] },
  { name: 'Hyderabad', position: [17.3850, 78.4867] as [number, number] },
  { name: 'Chennai', position: [13.0827, 80.2707] as [number, number] },
  { name: 'Gujarat (Ahmedabad)', position: [23.0225, 72.5714] as [number, number] },
  { name: 'Bihar (Patna)', position: [25.5941, 85.1376] as [number, number] },
];

export default function MapPageClient() {
  const mapCenter: [number, number] = [22.5937, 78.9629];

  return (
    <Card className="flex-1 p-2">
      <MapContainer center={mapCenter} zoom={5} style={{ height: '100%', width: '100%' }} className="rounded-md">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {locations.map((loc) => (
            <Marker key={loc.name} position={loc.position} icon={redIcon}>
              <Popup>
                <div className="space-y-1">
                    <h3 className="font-bold text-base">{loc.name}</h3>
                    <p className="text-sm text-muted-foreground">Key monitoring area.</p>
                </div>
              </Popup>
            </Marker>
        ))}
      </MapContainer>
    </Card>
  );
}
