import { StaticMap } from "@/components/admin/static-map";

export default function MapPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Static Threat Map</h1>
        <p className="text-muted-foreground">
          A static overview of key locations being monitored.
        </p>
      </div>
      <StaticMap />
    </div>
  );
}
