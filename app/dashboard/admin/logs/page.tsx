import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth";

const mockLogs = [
  { id: "1", event: "Role updated for user", actor: "Admin", at: "Today, 10:24 AM" },
  { id: "2", event: "Request marked resolved", actor: "Staff", at: "Today, 09:11 AM" },
  { id: "3", event: "New complaint submitted", actor: "Student", at: "Yesterday, 07:49 PM" },
];

export default async function AdminLogsPage() {
  await requireRole(["admin"]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="section-heading">System Logs</h1>
        <p className="text-sm text-muted-foreground">Monitor recent operational activity across the portal.</p>
      </div>
      <Card className="border-indigo-100">
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockLogs.map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">{log.event}</p>
              <p className="mt-1 text-xs text-slate-500">
                {log.actor} - {log.at}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
