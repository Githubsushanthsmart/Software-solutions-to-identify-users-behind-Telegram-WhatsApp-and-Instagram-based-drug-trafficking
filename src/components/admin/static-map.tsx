"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin } from "lucide-react";

const locations = [
  { name: "Mumbai", lat: 19.0760, lon: 72.8777, top: "83%", left: "26%" },
  { name: "Hyderabad", lat: 17.3850, lon: 78.4867, top: "80%", left: "42%" },
  { name: "Goa", lat: 15.2993, lon: 74.1240, top: "85%", left: "31%" },
  { name: "Bihar", lat: 25.5941, lon: 85.1376, top: "54%", left: "59%" },
  { name: "Sikkim", lat: 27.3389, lon: 88.6065, top: "49%", left: "67%" },
];

export function StaticMap() {
  return (
    <Card className="flex-1">
      <CardContent className="p-2 h-full">
        <div className="relative w-full h-[calc(100vh-14rem)]">
          <Image
            src="https://i.imgur.com/rS2yv5j.jpeg"
            alt="Detailed map of India with states and cities"
            fill
            className="object-cover rounded-md"
            data-ai-hint="india map states"
          />
          {locations.map((loc) => (
            <Tooltip key={loc.name}>
              <TooltipTrigger
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: loc.top, left: loc.left }}
              >
                <MapPin className="size-8 text-red-500 animate-pulse" strokeWidth={2.5}/>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{loc.name}</p>
                <p className="text-sm text-muted-foreground">Lat: {loc.lat}, Lon: {loc.lon}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
