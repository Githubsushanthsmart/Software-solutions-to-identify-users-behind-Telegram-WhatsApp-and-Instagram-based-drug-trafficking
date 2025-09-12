import { Dashboard } from "@/components/admin/dashboard";

export default function AdminPage() {
  return (
    <div className="flex h-full flex-col gap-6">
       <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and review all suspicious activity detected by the system.
        </p>
      </div>
      <Dashboard />
    </div>
  );
}
